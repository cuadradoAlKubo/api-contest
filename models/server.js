const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');


class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.paths = {
            test: '/api/v1/test',
            auth: '/api/v1/auth',
            prize: '/api/v1/prizes',
            contest: '/api/v1/contests'
        }


        // Conectar a BDD
        this.conectarDB();

        // Middlewares

        this.middlewares();

        // Rutas de mi apliacion
        this.routes()
    }

    async conectarDB () {
        await dbConnection();
    }

    middlewares () {
        // CORS 
        this.app.use(cors())

        // Lectura y parso del body
        this.app.use(express.json())

        // Directorio publico
        this.app.use(express.static('public'))

        // Fileupload - Carga de arcivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))

    }
    routes () {
      this.app.use(this.paths.test, require('../routes/test'));
      this.app.use(this.paths.auth, require('../routes/auth'));
      this.app.use(this.paths.prize, require('../routes/prize'));
      this.app.use(this.paths.contest, require('../routes/contest'));
        
    }

    listen () {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en ${this.port}`)
        })
    }
}

module.exports = Server