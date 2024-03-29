const axios = require('axios');
const { request, response } = require('express');
const { Contest } = require('../models');
const {
  STATUS_CODE_OK,
  BAD_REQUEST_STATUS_CODE,
  SERVER_ERROR_CODE,
} = require('../responses/responses-status');
const responses = require("../responses/response");
const { validateDiscordUser,validateDiscordUserByUsername } = require('../helpers/validate-discord-user');
const { addUserToEvent } = require('../helpers/addUserToEvent');

const eventBus = require('../helpers/eventBus');
eventBus.on('interaction', async (interaction) =>
{
  if (!interaction.isButton()) return;
  const validCustomIds = await Contest.find();
  const customIds = validCustomIds.map(contest => contest._id.toString());
  if (!customIds.includes(interaction.customId)) {
    console.log('El ID personalizado no es válido.');
    await interaction.reply('El ID personalizado no es válido.');
    return;
  }

  try {
    const result = await addUserToEvent(interaction.customId, interaction.user.id);
    await interaction.reply(`${ interaction.user.username }, has sido registrado`);
  } catch (error) {
    if (interaction.deferred && !interaction.replied) {
      await interaction.followUp('Ocurrió un error al procesar tu solicitud.');
    }
  }
});

const subscribeToContest = async (req = request, res = response) =>
{
  const { contestId } = req.params;
  const { discordUser } = req.body;

  try {
    const userIsValid = await validateDiscordUserByUsername(discordUser);
    if (!userIsValid) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE,[] ,'No es un usuario de Discord válido');
    }
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return responses.error(req, res, BAD_REQUEST_STATUS_CODE, 'Sorteo no encontrado');
    }

    const subscriptionResult = await addUserToEvent(contestId, discordUser);
    if (subscriptionResult === 'done') {
      return responses.success(req, res, STATUS_CODE_OK, { contestId, discordUser }, 'Registrado correctamente');
    } else {
      return responses.error(req, res, SERVER_ERROR_CODE, 'Error al suscribirse');
    }
  } catch (error) {
    console.log(error);
    return responses.error(req, res, SERVER_ERROR_CODE,[], 'Something went wrong');
  }
};

module.exports = {
  subscribeToContest
};
