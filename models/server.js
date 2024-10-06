const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios'

        //Conectar con la DB
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Funciones de las rutas
        this.routes();
    }

    async conectarDB() {
        await dbConection();
    }

    middlewares() { //Cuando se usa el -USE- se habla de un middleware
        //CORS
        this.app.use(cors())

        //Leer lo que envia el usuario por el body de la peticion
        this.app.use(express.json());

        //Definir la carpeta publica que creamos
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server online port: ', this.port);
        })
    }
}

module.exports = Server;