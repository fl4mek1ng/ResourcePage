'use strict';

import express from "express";
import UsuarioController from "../Controller/UsarioController.js"; 

const UsuarioRouter = express.Router();

//Peticiones Get
UsuarioRouter.get('/usuario', UsuarioController.obtenerDatosUsuarios); //Obtiene todos los usuarios de la Base de Datos
UsuarioRouter.get('/usuario/:nombre', UsuarioController.obtenerDatosUsuarioByNombre); //Obtiene los datos de los usuarios por el nombre del Usuario
UsuarioRouter.get('/usuario/email/:email', UsuarioController.obtenerDatosUsuarioByEmail); //Obtiene los datos de los usuarios por el email del Usuario


//Peticiones Post
UsuarioRouter.post('/usuario', UsuarioController.guardarDatosUsuario);// Guarda un usuario nuevo indicando los valores requeridos para el registro

//Peticiones Put
UsuarioRouter.put('/usuario/:email', UsuarioController.actualizarDatosUsuario);

//Peticiones Delete
UsuarioRouter.delete('/usuario/:email', UsuarioController.eliminarUsuario);


export default UsuarioRouter;
