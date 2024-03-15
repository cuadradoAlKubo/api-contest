const axios = require('axios'); // Asegúrate de tener Axios instalado
const { request, response } = require('express');
const { Contest } = require('../models');
const {UserByContest} = require('../models');
const {
  STATUS_CODE_OK,
  SERVER_ERROR_CODE,
} = require('../responses/responses-status');
const responses = require("../responses/response");
const { getClient, sendMessageWithButtons } = require('../discord/discordConfig');
const eventBus = require('../helpers/eventBus');

const suscriptToContest = async (req = request, res = response) =>
{
  const {contestId} = req.params;
  const {discordUser} = req.body;
  try {

    const contest = Contest.findById(contestId);
    if(!contest){
      return responses.error(req, res, STATUS_CODE_OK, 'Contest not found')
    }
    const validateUserByContest = UserByContest.findOne({discordUser, contestId});
    if(validateUserByContest){
      return responses.error(req, res, STATUS_CODE_OK, 'User already suscripted to contest')
    }
    let data ={discordUser, contestId}

    eventBus.on('interaction', async (interaction) => {
      // Asegúrate de filtrar las interacciones por customId si tienes múltiples tipos
      if (interaction.customId === contestId  ) {

        const user = interaction.user;    
        const validateUserByContest = UserByContest.findOne({discordUser:user.username, contestId});
        if(!validateUserByContest){
           data = { discordUser:user.username, contestId };

        }


        console.log('Hola, ${user.username}! desde contest register');
        // Aquí puedes implementar tu lógica específica, como responder a la interacción
        // o realizar alguna acción basada en la interacción y el usuario que la inició
        // await interaction.reply(`Hola, ${user.username}! Te has registrado con éxito.`);
      }
    });
    
    const userByContest = new UserByContest(data);
    const response = await userByContest.save();
    return responses.success(req, res, STATUS_CODE_OK, response, 'User suscripted to contest')
  } catch (error) {
    console.log(error)
    return responses.error(req, res, SERVER_ERROR_CODE, 'Something went wrong')
  }
}


module.exports = {
  suscriptToContest
}