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

  client.on('interactionCreate', async interaction => {  
    // Emitir la interacción para ser manejada en otra parte
    eventBus.emit('interaction', interaction);
  });
  
  client.on('messageCreate', async message => {
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

  const components = buttons.map(button => {
    const buttonBuilder = new ButtonBuilder()
        .setLabel(button.label)
        .setStyle(ButtonStyle[button.style]);

    // Diferenciar entre botones de enlace y botones con customId
    if (button.url) {
        buttonBuilder.setURL(button.url);
    } else if (button.customId) {
        buttonBuilder.setCustomId(button.customId);
    }

    return new ActionRowBuilder().addComponents(buttonBuilder);
});

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
