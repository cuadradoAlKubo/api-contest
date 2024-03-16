
const axios = require('axios'); // Asegúrate de tener Axios instalado
const { request, response } = require('express');
const { Contest, Round, Prize, UserByContest } = require('../models');
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
} = require('../responses/responses-status');
const responses = require("../responses/response");
const { getClient, sendMessageWithButtons } = require('../discord/discordConfig');
const eventBus = require('../helpers/eventBus');
const channelId = "986751464913371208";
const createRound = async (req = request, res = response) =>
{
  const { contestId, round } = req.body;
  // Obtener la sorteo por ID
  const contest = await Contest.findById(contestId);
  if (!contest) {
    return responses.error(req, res, SERVER_ERROR_CODE, 'Sorteo no encontrada');
  }

  // Verificar el número máximo de rondas
  const rondasExistentes = await Round.countDocuments({ contestId: contestId });
  if (rondasExistentes >= contest.rounds) {
    return responses.error(req, res, SERVER_ERROR_CODE, 'Ya se alcanzó el número máximo de rondas para este sorteo');
  }

  // Seleccionar el primer premio basado en orderToLot
  const primerPremio = await Prize.findOne({ contestId: contestId, orderToLot: round });
  if (!primerPremio) {
    return responses.error(req, res, SERVER_ERROR_CODE, 'Premio para la primera ronda no encontrado');
  }
  const userByContest = await UserByContest.find({ contestId: contestId, status: 'PENDING' }).populate('discordUser');

  // Cretae new round
  const newRound = new Round({
    roundNumber: round,
    contestId: contestId,
    prizeId: primerPremio._id,
    participants: userByContest
  });

  const response = await newRound.save();
  await sendMessageWithButtons(channelId, `Preparence para la ronda ${ round } del sorteo ${ contest.name }!`, []);
  return responses.success(req, res, STATUS_CODE_OK, response, 'Round created');

}


const playRound = async (req = request, res = response) =>
{
  // Obtener la ronda por ID, incluyendo participantes y premio
  const { roundId } = req.params;
  const validateRound = await Round.findById(roundId).populate('participants');
  if (!validateRound) {
    return responses.error(req, res, SERVER_ERROR_CODE, 'Ronda no encontrada');
  }

  // Seleccionar un ganador aleatoriamente de los participantes
  const winnerIndex = Math.floor(Math.random() * validateRound.participants.length);
  const winner = validateRound.participants[ winnerIndex ];
  // Opcionalmente, actualizar el premio asociado a marcar como entregado
  const prize = await Prize.findByIdAndUpdate(validateRound.prizeId, { winner: winner._id, markAsDelivery: true });
  await UserByContest.findByIdAndUpdate(winner._id, { status: 'WINNER' });

  await Round.findByIdAndUpdate(roundId, { winners: winner._id });
  await sendMessageWithButtons(channelId, `El ganador del premio ${ prize.name } es ${ winner.discordUser } `, []);
  return responses.success(req, res, STATUS_CODE_OK, winner, 'Round played');
}


module.exports = {
  createRound,
  playRound
}