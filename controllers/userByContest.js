const axios = require('axios'); // Asegúrate de tener Axios instalado
const { request, response } = require('express');
const { Contest, UserByContest } = require('../models');
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
} = require('../responses/responses-status');
const responses = require("../responses/response");
const { getClient, sendMessageWithButtons } = require('../discord/discordConfig');
const eventBus = require('../helpers/eventBus');
const { addUserToEvent } = require('../helpers/addUserToEvent')

eventBus.on('interaction', interaction =>
{
  // Puedes manejar todas las interacciones aquí de forma centralizada
  if (interaction.isButton()) {

    addUserToEvent(interaction.customId, interaction.user.username).then(res =>
    {
      if (res === 'done') {
        interaction.reply(`${ interaction.user.username }, te has suscrito al concurso exitosamente.`);
      } else {
        interaction.reply(`${ interaction.user.username }, ${res}.`);
      }
    });
  }
});

const suscriptToContest = async (req, res) =>
{
  const { contestId } = req.params;
  const { discordUser } = req.body;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return responses.error(req, res, STATUS_CODE_OK, 'Contest not found');
    }
    const res = await addUserToEvent(contestId, discordUser)
    // Resto de la lógica de suscripción...

    if (res === 'done') {
      return responses.success(req, res, STATUS_CODE_OK, { contestId, discordUser }, 'Suscription process initiated');
    } else {
      return responses.error(req, res, STATUS_CODE_OK, [], 'Error al suscribirse');
    }

  } catch (error) {
    console.log(error);
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong');
  }
};


module.exports = {
  suscriptToContest
}