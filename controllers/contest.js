const { request, response } = require('express');
const { Contest, Prize, UserByContest } = require('../models');
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
  BAD_REQUEST_STATUS_CODE, // Asegúrate de tener esta constante definida si se usa
} = require('../responses/responses-status');
const responses = require("../responses/response");
const { getClient, sendMessageWithButtons } = require('../discord/discordConfig');

const eventBus = require('../helpers/eventBus');
const { addUserToEvent } = require('../helpers/addUserToEvent')


// Considera definir el channelId globalmente si es constante
const channelId = "986751464913371208";
const createContest = async (req = request, res = response) =>
{
  const userId = req.uid;
  const { name, rounds, contestDate, contestStatus } = req.body;
  try {
    const data = { name, rounds, contestDate, contestStatus, createdBy: userId };
    const contest = new Contest(data);
    const savedContest = await contest.save();

    const buttons = [ {
      customId: savedContest._id.toString(),
      label: 'Registrarse',
      style: 1, // Estilo primario (azul)
      url: `https://privatedevs.com/api-contest/api/v1/suscriptions/${ savedContest.toString() }`
    } ];
    await sendMessageWithButtons(channelId, `¡Nuevo sorteo disponible! ${ name } el ${ contestDate }, para registrarse haz clic en el siguiente enlace:`, buttons);
    // //* Se implementa socket para actualizar lista de sorteos
    // const getAllContest = await Contest.find();
    // req.io.emit('getContests', getAllContest);

    return responses.success(req, res, STATUS_CODE_OK, savedContest, 'Contest created');
  } catch (error) {
    console.log(error);
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong');
  }
};

const getContests = async (req = request, res = response) =>
{
  try {
    const contests = await Contest.find().populate('createdBy', 'name');
    return responses.success(req, res, STATUS_CODE_OK, contests, 'Contests found');
  } catch (error) {
    console.log(error);
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong');
  }
};

const getContestById = async (req = request, res = response) =>
{
  const { contestId } = req.params;
  try {
    const [ contest, prizes, registeredUsers ] = await Promise.all([
      Contest.findById(contestId),
      Prize.find({ contestId }).sort({ orderToLot: 'asc' }),
      UserByContest.find({ contestId })
    ]);
    const data = { contest, prizes, registeredUsers };
    return responses.success(req, res, STATUS_CODE_OK, data, 'Contest found');
  } catch (error) {
    console.log(error);
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong');
  }
};

const updateContest = async (req = request, res = response) =>
{
  const { contestId } = req.params
  const { name, rounds, contestDate, contestStatus } = req.body
  try {
    const contest = await Contest.findById(contestId)
    if (!contest) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    contest.name = name
    contest.rounds = rounds
    contest.contestDate = contestDate
    contest.contestStatus = contestStatus

    const buttons = [ {
      customId: contestId,
      label: 'Ver evento',
      style: 1, // Estilo primario (azul)
      url: `${ process.env.public }/contest/${ contestId }`
    } ];
    await sendMessageWithButtons(channelId, `El sorteo ${ name } fue modificado`, buttons);
    await Contest.findByIdAndUpdate(contestId, contest, { new: true })
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest updated')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const deleteContest = async (req = request, res = response) =>
{
  const { contestId } = req.params
  try {
    const contest = await Contest.findById(contestId)
    if (!contest) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    await Contest.findByIdAndUpdate(contestId, { status: false }, { new: true })
    await sendMessageWithButtons(channelId, `El sorteo ${ contest.name } ha sido eliminado`,[]);
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest deleted')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const promotionContest = async (req = request, res = response) =>
{
  const { contestId } = req.params
  try {
    const contest = await Contest.findById(contestId)
    if (!contest) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    const channelId = "986751464913371208";
    const buttons = [ {
      customId: contestId,
      label: 'Registrarse',
      style: 1, // Estilo primario (azul)
    } ];
    await sendMessageWithButtons(channelId, `¡Recuerda que sorteo sigue disponible! ${ contest.name } el ${ contest.contestDate }, para regitrarse haz clic en el siguiente enlace:`, buttons);
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest published')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

module.exports = {
  createContest,
  getContests,
  getContestById,
  updateContest,
  deleteContest,
  promotionContest
}