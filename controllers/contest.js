const axios = require('axios'); // Asegúrate de tener Axios instalado
const { request, response } = require('express');
const { Contest, Prize, UserByContest } = require('../models');
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
} = require('../responses/responses-status');
const responses = require("../responses/response");
const { getClient, sendMessageWithButtons } = require('../discord/discordConfig');
const eventBus = require('../helpers/eventBus');

const createContest = async (req = request, res = response) =>
{
  const userId = req.uid;
  const { name, rounds, contestDate } = req.body;
  try {
    const data = { name, rounds, contestDate, createdBy: userId };
    const contest = new Contest(data);
    const response = await contest.save();
    // Enviar un mensaje a Discord con botones
    const channelId = "986751464913371208";
    const buttons = [ {
      customId: response._id.toString(),
      label: 'Registrarse',
      style: 1, // Estilo primario (azul)
      url: `https://privatedevs.com/api-contest/api/v1/suscriptions/${ response._id.toString() }`
    } ];
    await sendMessageWithButtons(channelId, `¡Nuevo sorteo disponible! ${ name } el ${ contestDate }, para regitrarse haz clic en el siguiente enlace:`, buttons);


    eventBus.on('interaction', async (interaction) =>
    {
      console.log('contest')
      // Asegúrate de filtrar las interacciones por customId si tienes múltiples tipos
      if (interaction.customId === response._id.toString()) {
        const user = interaction.user;
        // Aquí puedes implementar tu lógica específica, como responder a la interacción
        // o realizar alguna acción basada en la interacción y el usuario que la inició
        await interaction.reply(`Hola, ${ user.username }! Te has registrado con éxito.`);
      }
    });
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest created')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const getContests = async (req = request, res = response) =>
{
  try {

    const contests = await Contest.find().populate('createdBy', 'name')
    return responses.success(req, res, STATUS_CODE_OK, contests, 'Contests found')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const getContestById = async (req = request, res = response) =>
{
  const { contestId } = req.params
  try {
    const [ contest, prizes, registeredUsers ] = await Promise.all([
      await Contest.findById(contestId),
      await Prize.find({ contestId }).sort({ orderToLot: 'asc' }),
      await UserByContest.find({ contestId })

    ])
    console.log(contest)
    const data = { contest, prizes, registeredUsers }
    return responses.success(req, res, STATUS_CODE_OK, [ data ], 'Contest found')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const updateContest = async (req = request, res = response) =>
{
  const { contestId } = req.params
  const { name, rounds, contestDate } = req.body
  try {
    const contest = await Contest.findById(contestId)
    if (!contest) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    contest.name = name
    contest.rounds = rounds
    contest.contestDate = contestDate

    const buttons = [ {
      customId: response._id.toString(),
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
    await sendMessageWithButtons(channelId, `El sorteo ${ constest.name } ha sido eliminado`);
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest deleted')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}

const publicContest = async (req = request, res = response) =>
{
  const { contestId } = req.params
  try {
    const contest = await Contest.findById(contestId)
    if (!contest) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, null, 'Contest not found')
    }
    await Contest.findByIdAndUpdate(contestId, { status: false }, { new: true })
    await sendMessageWithButtons(channelId, `El sorteo ${ constest.name } ha sido eliminado`);
    return responses.success(req, res, STATUS_CODE_OK, contest, 'Contest deleted')
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
  deleteContest
}