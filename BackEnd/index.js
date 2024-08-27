'use strict'
//Importacion de dependencias
import mongoose from "mongoose";
import chalk from "chalk";
import app from "./app.js";

//url para conexion a la base de datos de mongoDB Educacion
const url = 'mongodb://localhost:27017/Educacion'
const port = 3900;

mongoose.Promise = global.Promise;

mongoose.connect(url)
    .then(() => {
        console.log(chalk.green('La conexión ha sido exitosa'));
        app.listen(port, () => {
            console.log(chalk.blue(`Servidor corriendo en http://localhost:${port}`));
        });
    })
    .catch((error) => {
        console.log(chalk.red('Error en la conexión a la base de datos:', error.message));
    });