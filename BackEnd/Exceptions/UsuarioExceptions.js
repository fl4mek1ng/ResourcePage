'use strict';

import validator from 'validator';
import Usuario from '../models/Usuario.js';
import chalk from 'chalk';

class UsuarioValidator {
    static async validarEmail(email) {
        if(validator.isEmpty(email)){
            return{
                status: 400,
                message:"Email vacio"
            }
        }

        // Validar el formato del email
        if (!validator.isEmail(email)) {
            return{
                status: 400,
                message:"Email no válido"
            }
        }

        // Verificar si el email ya existe en la base de datos
        const emailExistente = await Usuario.findOne({ email: email });
        if (emailExistente) {
            return{
                status: 400,
                message:"El email ya está registrado"
            }
        }
    }

    static async validarNombre(nombre) {
        if(!validator.isLength(nombre, { min: 2, max: 50 }) ){
            return{
                status: 400,
                message:"El nombre no cumple con la extension de caracteres",
                error: "El nombre no cumple con la extension de caracteres"
            }
           
        }
        if(!validator.isAlpha(nombre.replace(/[\s'-]/g, ''), 'es-ES')){
            return{
                status: 400,
                message:"El nombre no cumple con el formato solo puede contener letras en este campo.",
                error:"El nombre no cumple con el formato solo puede contener letras en este campo."
            }
        }
    }

    static async validarListaUsuarios(usuarios){
        if(validator.isEmpty(usuarios.toString())){
            console.log(chalk.yellow("No se encontraron usuarios en la base de datos"))
            return{
                status: 404,
                message:"No se encontraron usuarios en la base de datos"
            }
        }
    }

    static async validarUsuarios(usuarios){
        if (!usuarios || usuarios.length === 0) {
            console.log(chalk.red(`El conjunto de usuarios está vacío`));
            return{
                status: 400,
                message:"No se encontraron usuarios con los valores de búsqueda proporcionados",
                error: "El conjunto de usuarios está vacío"
            }
        }
    
        for (let usuario of usuarios) {
            if (validator.isEmpty(usuario.nombre || '')) {
                console.log(chalk.yellow(`El usuario encontrado no tiene un nombre válido`));
                return{
                    status: 400,
                    message:"Se encontró un usuario sin nombre válido",
                    error: "Se encontró un usuario sin nombre válido"
                }
            }
            if (validator.isEmpty(usuario.email || '')) {
                console.log(chalk.yellow(`El usuario ${usuario.nombre} no tiene un email válido`));
                return{
                    status: 400,
                    message:"Se encontró un usuario sin un email válido",
                    error: "Se encontró un usuario sin un email válido"
                }
            }
        }
    }

    static async validarUsuario(usuario) {
        if (validator.isEmpty(usuario.nombre || '')) {
            console.log(chalk.yellow(`El usuario encontrado no tiene un nombre válido`));
            return{
                status: 400,
                message:"Se encontró un usuario sin nombre válido",
                error: "Se encontró un usuario sin nombre válido"
            }

        }
        if (validator.isEmpty(usuario.email || '')) {
            console.log(chalk.yellow(`El usuario ${usuario.nombre} no tiene un email válido`));
            return{
                status: 400,
                message:"Se encontró un usuario sin un email válido",
                error: "Se encontró un usuario sin un email válido"
            }

        }
    }
}

export default UsuarioValidator;
