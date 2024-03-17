const axios = require('axios');

async function validateDiscordUser(userId) {
    console.log('Validando usuario de Discord:', userId)
    const url = `https://discord.com/api/users/${userId}`; 

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}` // Usa 'Bot' o 'Bearer' según el tipo de token
            }
        });

        // Si hay datos en la respuesta, el usuario es válido
        console.log(response.data); // Aquí puedes ver la información del usuario
        return true; // El usuario es válido
    } catch (error) {
        console.error('Error al validar el usuario de Discord:', error);
        return false; // El usuario no es válido o no se pudo validar
    }
}
async function validateDiscordUserByUsername(username) {
    console.log('Validando usuario de Discord:', username);
    const botToken = process.env.DISCORD_TOKEN;
    const url = `https://discord.com/api/guilds/${process.env.DISCORD_SERVER_ID}/members`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bot ${botToken}`
            },
            params: {
                limit: 1000
            }
        });

        const members = response.data;
        console.log('Miembros del servidor:', members);
        const user = members.find(member => 
            member.user.username === username
        );

        if (user) {
            console.log('Usuario encontrado:', user);
            return true;
        } else {
            console.log('Usuario no encontrado');
            return false;
        }
    } catch (error) {
        console.error('Error al validar el usuario de Discord:', error);
        return false;
    }
}
module.exports = {
  validateDiscordUser,
  validateDiscordUserByUsername
};