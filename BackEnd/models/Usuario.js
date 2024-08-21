'use strict'

// Importar mongoose para definir el esquema del modelo
import mongoose from "mongoose";

// Obtener el constructor Schema de mongoose
const schema = mongoose.Schema;

// Definir el esquema del modelo User
const UsuarioSchema = new schema({
    nombre: {
        type:String,
        required: true,
    }, // Nombre del usuario
    email: {
        type: String,
        required: true,
        unique: true
    },//Email del usuario
    contraseña: {
        type: String,
        required: true
    },// Contraseña del usuario (asegurarse de hashearla de forma segura en una aplicación real)
    avatar: {
        type: String, // Aquí puedes almacenar la URL o los datos del logo generado
        required: true
    }, 
    fechaRegistro: {
        type: Date, default: Date.now
    }, // Fecha de registro del usuario, por defecto la fecha actual 
    superUsuario:{
        type: Boolean, // Aquí puedes almacenar la URL o los datos del logo generado
        required: true
    },// Indica si el usuario es superusuario o no
    activo:{
        type: Boolean,
        required: true,
        default: true
    }
});

// Exportar el modelo User basado en el esquema UserSchema
export default mongoose.model('Usuario', UsuarioSchema);



