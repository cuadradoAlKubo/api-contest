const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle  } = require('discord.js');
const axios = require('axios');
const eventBus = require('../helpers/eventBus');
let clientInstance;

const initializeClient = async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

  client.once('ready', () => {
    console.log('¡El bot está en línea!');
  });

  await client.login(process.env.DISCORD_TOKEN);

  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // Emitir la interacción al eventBus sin necesidad de un manejador específico aquí
    eventBus.emit('interaction', interaction);
  });

  client.on('messageCreate', async message => {
    // Ejemplo: Detectar un comando específico y realizar una acción
    if (message.content === '!evento') {
      // Aquí puedes emitir el mensaje al eventBus o manejarlo directamente
      // Por ejemplo, emitir el evento de mensaje para ser manejado por otra parte de la aplicación
      eventBus.emit('message', message);
    }

  });

  return client;
};

const sendMessageWithButtons = async (channelId, messageText, buttons) => {
  const client = await getClient(); // Asume que esta función te devuelve la instancia del cliente Discord
     // Convertir la definición de botones a componentes de discord.js
  const components = buttons.map(button => new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(button.customId)
      .setLabel(button.label)
      .setStyle(ButtonStyle[button.style]) // Asegúrate de usar ButtonStyle para definir el estilo
  ));

    // Envío de un mensaje a Discord usando Axios
    const DISCORD_BOT_TOKEN = process.env.DISCORD_TOKEN; // Asegúrate de que esta variable esté definida en tus variables de entorno
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const body = {
        content: messageText,
        // Usa .toJSON() para serializar correctamente cada fila de componentes
        components: components.map(component => component.toJSON())
    };
    await axios.post(url, body, {
        headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

};

const getClient = async () => {
  if (!clientInstance) {
    clientInstance = await initializeClient();
  }
  return clientInstance;
};

module.exports = { getClient, sendMessageWithButtons };