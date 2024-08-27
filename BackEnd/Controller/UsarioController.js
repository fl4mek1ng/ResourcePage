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

            let sortOrder;
            let sortBy = request.query.sortBy || 'fechaRegistro';
            if (request.query.order) {
                let order = request.query.order.toLowerCase();
                if (order === 'asc') {
                    sortOrder = 1;
                } else if (order ==='desc'){
                    sortOrder = -1;
                } else if (order !== 'desc') {
                    // Si el valor de 'order' no es 'asc' ni 'desc', podrías devolver un error
                    return response.status(400).send({
                        message: "El parámetro 'order' debe ser 'asc' o 'desc'."
                    });
                }
            }


            let usuarios = await Usuario.find().sort({[sortBy]: sortOrder});
            
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
            let sortOrder;
            let sortBy = request.query.sortBy || 'fechaRegistro';
            if (request.query.order) {
                let order = request.query.order.toLowerCase();
                if (order === 'asc') {
                    sortOrder = 1;
                }else if (order ==='desc'){
                    sortOrder = -1;
                } else if (order !== 'desc') {
                    // Si el valor de 'order' no es 'asc' ni 'desc', podrías devolver un error
                    return response.status(400).send({
                        message: "El parámetro 'order' debe ser 'asc' o 'desc'."
                    });
                }
            }

            let nombreSinSanitizar = request.params.nombre;
            nombre = validator.blacklist(nombreSinSanitizar, '!"#$%&/()=?¿¡');
            let regex = new RegExp(nombre, 'i');
            
            let usuario = await Usuario.find({ nombre: regex }).sort({[sortBy]: sortOrder});

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
            let sortOrder;
            let sortBy = request.query.sortBy || 'fechaRegistro';
            if (request.query.order) {
                let order = request.query.order.toLowerCase();
                if (order === 'asc') {
                    sortOrder = 1;
                }else if (order ==='desc'){
                    sortOrder = -1;
                } else if (order !== 'desc') {
                    // Si el valor de 'order' no es 'asc' ni 'desc', podrías devolver un error
                    return response.status(400).send({
                        message: "El parámetro 'order' debe ser 'asc' o 'desc'."
                    });
                }
            }

            let emailSinSanitizar = request.params.email;
            email = validator.blacklist(emailSinSanitizar, '!"#$%&/()=?¿¡');
            let regex = new RegExp(email, 'i');
            
            let usuario = await Usuario.find({ email: regex }).sort({[sortBy]: sortOrder});

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
            let nombreSinSanitizar = request.body.nombre;
            let emailSinSanitizar = request.body.email;

            let nombre = validator.blacklist(nombreSinSanitizar, '!"#$%&/()=?¿¡');
            let email = validator.blacklist(emailSinSanitizar, '!"#$%&/()=?¿¡');

            await UsuarioValidator.validarNombre(nombre);
            await UsuarioValidator.validarEmail(email);

            let contraseña = crypto.randomBytes(8).toString('hex'); 
            let hashedContraseña = await bcrypt.hash(contraseña, 10);

            let avatar = await generarAvatar(nombre);
        
            const nuevoUsuario = new Usuario({
                nombre,
                email,
                contraseña: hashedContraseña,
                avatar: avatar,
                superUsuario: request.body.superUsuario || false, // Si existe, usa el valor, sino false
                activo: request.body.activo ?? true
            });


            await nuevoUsuario.save();


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

            if (request.body.hasOwnProperty('activo')) {
                nuevosDatos.activo = request.body.activo;
            }
            if (request.body.hasOwnProperty('superUsuario')) {
                nuevosDatos.superUsuario = request.body.superUsuario;
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

async function generarAvatar(nombreUsuario){

    const valor = '0123456789ABCDEF';
    let avatar;
    let color = '#';
    let nombre = nombreUsuario;

    for (let i = 0; i< 6 ; i++){
        color += valor[Math.floor(Math.random() * valor.length)];
    }

    let primerLetra = nombre.substring(0, 1);

    avatar = `${primerLetra}${color}`;

    return avatar;
}
export default UsuarioController;
