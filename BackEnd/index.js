'use strict'
//Importacion de dependencias
import mongoose from "mongoose";
import chalk from "chalk";
import app from "./app.js";

//url para conexion a la base de datos de mongoDB Educacion
const url = 'mongodb://localhost:27017/Educacion'
const port = 3900;

mongoose.Promise = global.Promise;


//Codigo para establecer Conexion con el servidor y la Base de datos Educacion
mongoose.connect(url)

//Codigo en caso de que la conexion sea exitosa con la Base de Datos
    .then(() =>{
      console.log(chalk.green('La conexion ha sido exitosa')); 
      
      //Crear servidor para la recepcion de peticiones
      app.listen(port, () =>{
        console.log(chalk.blue('Servidor corriendo en http://localhost:'+port));
      })

})
//Codigo en caso de que la conexion NO sea exitosa con la Base de Datos
.catch((error) => {
    console.log(chalk.red('Error en la conexión a la base de datos:', error.message));
}

);