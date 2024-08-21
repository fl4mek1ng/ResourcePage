'use strict';

import chalk from "chalk";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from 'validator';

import Usuario from "../models/Usuario.js";
import UsuarioValidator from '../Exceptions/UsuarioExceptions.js';  // Importa el validador


const UsuarioController = {
    obtenerDatosUsuarios: async (request, response) => {
        try {

            const sortBy = request.query.sortBy || 'fechaRegistro';
            const sortOrder = request.query.order === 'asc' ? 1 : -1;


            const usuarios = await Usuario.find().sort({[sortBy]: sortOrder});
            
            await UsuarioValidator.validarListaUsuarios(usuarios);

            console.log(chalk.green("Peticion correctamente respondida"));
            return response.status(200).send({
                message: "Petición de GET para los datos de los usuarios",
                usuarios
            });

        }catch (error) {
            console.log(chalk.red("Error al obtener los datos de los usuarios"));
            return response.status(500).send({
                message: "Petición de GET para los datos de los usuarios",
                error: error.message
            }); 
        }
       
    },

    obtenerDatosUsuarioByNombre: async (request, response) => {
        let nombre;
        try{
            const nombreSinSanitizar = request.params.nombre;
            nombre = validator.blacklist(nombreSinSanitizar, '!"#$%&/()=?¿¡');
            const regex = new RegExp(nombre, 'i');
            
            const usuario = await Usuario.find({ nombre: regex });

            await UsuarioValidator.validarUsuarios(usuario);

            console.log(chalk.green("Peticion correctamente respondida"));
            return response.status(200).send({
                message: `Datos del usuario con Nombre: ${nombre}`,
                usuario
            });

        }catch (error) {
            console.log(chalk.red("Fallo en la peticion"));
            return response.status(500).send({
                message: `Error al obtener los datos del usuario con nombre: ${nombre} por favor compruebe que esta ingresando correctamente el nombre`,
                error: error.message
            });
        }
    },

    obtenerDatosUsuarioByEmail: async (request, response) => {
        let email;
        try{
            const emailSinSanitizar = request.params.email;
            email = validator.blacklist(emailSinSanitizar, '!"#$%&/()=?¿¡');
            const regex = new RegExp(email, 'i');
            
            const usuario = await Usuario.find({ email: regex });

            await UsuarioValidator.validarUsuarios(usuario);

            console.log(chalk.green("Peticion correctamente respondida"));
            return response.status(200).send({
                message: `Datos del usuario con Email: ${email}`,
                usuario
            });

        }catch (error) {
            console.log(chalk.red("Fallo en la peticion"));
            return response.status(500).send({
                message: `Error al obtener los datos del usuario con Email: ${email} por favor compruebe que esta ingresando correctamente el nombre`,
                error: error.message
            });
        }
    },

    guardarDatosUsuario: async (request, response) => {
        try {
            const nombreSinSanitizar = request.body.nombre;
            const emailSinSanitizar = request.body.email;
            const superUsuario = request.body.superusuario;

            const nombre = validator.blacklist(nombreSinSanitizar, '!"#$%&/()=?¿¡');
            const email = validator.blacklist(emailSinSanitizar, '!"#$%&/()=?¿¡');

            await UsuarioValidator.validarNombre(nombre);
            await UsuarioValidator.validarEmail(email);

            const contraseña = crypto.randomBytes(8).toString('hex'); 
            const hashedContraseña = await bcrypt.hash(contraseña, 10);
                console.log("la contraseña es: "+contraseña);
                console.log("la contraseña encriptada es: "+hashedContraseña);
        
            const nuevoUsuario = new Usuario({
                nombre,
                email,
                contraseña: hashedContraseña,
                avatar: 'test',
                superUsuario
            });

                console.log(nuevoUsuario);

            await nuevoUsuario.save();

        //const user = await nuevoUsuario.save(); 

                console.log(chalk.green("Peticion correctamente respondida"));
            return response.status(201).send({
                message: `Guardado correctamente el usuario : ${nuevoUsuario.nombre}`,
                status: 'success',
            });

            
        } catch (error) {
            console.log(chalk.red("Fallo en la peticion de guardado de usuarios."));
            return response.status(500).send({
                message: `Error al guardar el usuario`,
                error: error.message
            });
        }
    },

    actualizarDatosUsuario: async (request, response) => {
        let email;
        try {
            
            const emailSinSanitizar = request.params.email;
            email = validator.blacklist(emailSinSanitizar, '!"#$%&/()=?¿¡');
            const regex = new RegExp(email, 'i');

            const nuevosDatos = {};
        
            if (request.body.nombre) {
             nuevosDatos.nombre = validator.blacklist(request.body.nombre, '!"#$%&/()=?¿¡');
            }

            if (request.body.email) {
             nuevosDatos.email = validator.blacklist(request.body.email, '!"#$%&/()=?¿¡');
            }

            // Si no hay campos para actualizar, devolver un error
            if (Object.keys(nuevosDatos).length === 0) {
              return response.status(400).send({
                  message: 'No se proporcionaron campos válidos para actualizar'
              });
            }
            const usuario = await Usuario.findOneAndUpdate({ email: regex }, nuevosDatos, { new: true });

            if (!usuario) {
                return response.status(404).send({
                    message: `No se encontró ningún usuario con el email: ${email}`
                });
            }
    
            await UsuarioValidator.validarUsuario(usuario);

            console.log(chalk.green("Peticion correctamente respondida"));
            return response.status(200).send({
                message: `Se han actualizado los datos del usuario con Email: ${email}`,
                usuario
            });
            
        } catch (error) {
            console.log(chalk.red("Fallo en la peticion de guardado de usuarios."));
            return response.status(500).send({
                message: `Error al actualizar el usuario`,
                error: error.message
            });
        }
    },

    eliminarUsuario: async (request, response) => {
        let email;
        try {
            const emailSinSanitizar = request.params.email;
            email = validator.blacklist(emailSinSanitizar, '!"#$%&/()=?¿¡');
            const regex = new RegExp(email, 'i');
    
            // Usar async/await para manejar la promesa de findOneAndDelete
            const usuarioEliminado = await Usuario.findOneAndDelete({ email: regex });
    
            if (!usuarioEliminado) {
                console.log(chalk.red("Fallo en la peticion de eliminacion de usuarios."));
                return response.status(404).send({
                    message: `Error al borrar el usuario, el usuario no existe`
                });
            }
    
            console.log(chalk.green("Peticion correctamente respondida"));
            return response.status(200).send({
                message: `Se ha eliminado el usuario con Email: ${email}`,
                usuario: usuarioEliminado
            });
    
        } catch (error) {
            console.log(chalk.red("Fallo en la peticion de eliminacion de usuarios."));
            return response.status(500).send({
                message: `Error al borrar el usuario`,
                error: error.message
            });
        }
    }
    
};

export default UsuarioController;