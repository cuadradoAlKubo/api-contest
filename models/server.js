const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { getClient } = require('../discord/discordConfig');
const { socketController } = require('../sockets/controller');

class Server
{
    constructor ()
    {

        this.app = express()
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server, {
            cors:{
                origin:true,
                method:['GET', 'PATCH', 'POST', 'PUT']
            }
        });
        this.paths = {
            test: '/api/v1/test',
            auth: '/api/v1/auth',
            prize: '/api/v1/prizes',
            contest: '/api/v1/contests',
            suscription: '/api/v1/suscriptions',
            playRound: '/api/v1/playRound',
            uploads: '/api/v1/uploads',
            users: '/api/v1/users',
        }


        // Conectar a BDD
        this.conectarDB();

        // Middlewares

        this.middlewares();

        // Rutas de mi apliacion
        this.routes()

        // Sockets
        this.sockets();
    }

    async conectarDB ()
    {
        await dbConnection();
    }
    async discortClient ()
    {
        try {
            const client = await getClient();
            this.discordClient = client; // Guardar la instancia del cliente en la propiedad de la clase
            console.log('Cliente de Discord conectado');
        } catch (error) {
            console.error('Error al conectar con Discord:', error);
            process.exit(1);
        }
    }
    middlewares ()
    {
        //SOCKETS
        this.app.use((req, res, next) =>
        {
            req.io = this.io;
            return next();
        });

        // CORS 
        this.app.use(cors())

        // Lectura y parso del body
        this.app.use(express.json())


        // Fileupload - Carga de arcivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))

    }
    routes ()
    {
        this.app.use(this.paths.test, require('../routes/test'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.prize, require('../routes/prize'));
        this.app.use(this.paths.contest, require('../routes/contest'));
        this.app.use(this.paths.suscription, require('../routes/userByContest'));
        this.app.use(this.paths.playRound, require('../routes/playContest'));
        this.app.use(this.paths.uploads, require('../routes/upload'));
        this.app.use(this.paths.users, require('../routes/user'));
    }

    sockets ()
    {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen ()
    {
        this.discortClient()
        // * con socket se usa this.server y sin socket this.app
        this.server.listen(this.port, () =>
        {
            console.log(`Servidor corriendo en ${ this.port }`)
        })
    }
}

module.exports = Server