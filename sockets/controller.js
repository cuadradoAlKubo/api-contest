const { comprobarJWT } = require('../middlewares');
const socketController = async (socket, io) =>
{
    if (!socket.handshake.headers.authorization) {
        const validar = await comprobarJWT(socket.handshake.headers.authorization.split(' ')[ 1 ])
        io.emit('user-connected', validar?.uid)

        socket.on('disconnected', (payload) =>
        {

            io.emit('user-disconnected', payload)
        })
    }
    // socket.broadcast.emit('bienvenido', socket.id) broadcast permite refrescar en todos
    // socket.emit('bienvenido', validar?.user.name)

}


module.exports = {
    socketController
}