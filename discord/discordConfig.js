const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const eventBus = require('../helpers/eventBus');

let clientInstance;

const initializeClient = async () =>
{
  if (clientInstance) return clientInstance;

  const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

  client.once('ready', () =>
  {
    console.log('¡El bot está en línea!');
  });

  await client.login(process.env.DISCORD_TOKEN);

  client.on('interactionCreate', async interaction =>
  {
    // Primero emitimos la interacción al eventBus antes de cualquier retorno anticipado
    eventBus.emit('interaction', interaction);
    try {
      // Asegúrate de reconocer la interacción lo antes posible
      await interaction.deferReply({ ephemeral: true });
      // Finalmente, edita la respuesta
       if (error.code === 10062) {
        console.log('La interacción ha caducado o ya ha sido respondida.');
        interaction.reply(`La interacción ha caducado o ya ha sido respondida..`);
      }
      if (error.code === 40060) {
        console.log('La interacción ha caducado o ya ha sido respondida.');
        interaction.reply(`La interacción ha caducado o ya ha sido respondida..`);
      }
      await interaction.editReply('Interacción completada con éxito.');

    } catch (error) {
      // Si la interacción ya no es válida, posiblemente no se pueda enviar este mensaje,
      // pero es útil para manejo de errores y registros
      if (error.code === 10062) {
        console.log('La interacción ha caducado o ya ha sido respondida.');
        interaction.reply(`La interacción ha caducado o ya ha sido respondida..`);
      }
      if (error.code === 40060) {
        console.log('La interacción ha caducado o ya ha sido respondida.');
        interaction.reply(`La interacción ha caducado o ya ha sido respondida..`);
      }
    }

  });

  client.on('messageCreate', async message =>
  {
    if (message.content === '!evento') {
      eventBus.emit('message', message);
    }
  });

  clientInstance = client;  // Almacena la instancia del cliente para reutilización
  return client;
};

const sendMessageWithButtons = async (channelId, messageText, buttons) =>
{
  const client = await getClient();

  const components = buttons.map(button =>
    new ActionRowBuilder()
      .addComponents(new ButtonBuilder()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(ButtonStyle[ button.style ])
      )
  );

  const body = {
    content: messageText,
    components: components.map(component => component.toJSON())
  };

  const url = `https://discord.com/api/v10/channels/${ channelId }/messages`;

  await axios.post(url, body, {
    headers: {
      Authorization: `Bot ${ process.env.DISCORD_TOKEN }`,
      'Content-Type': 'application/json',
    },
  });
};

const getClient = async () =>
{
  return clientInstance || initializeClient();
};

module.exports = { getClient, sendMessageWithButtons };
