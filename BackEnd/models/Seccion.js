'use strict'

// Importar mongoose para definir el esquema del modelo
import mongoose from "mongoose";

// Obtener el constructor Schema de mongoose
const schema = mongoose.Schema;

// Definir el esquema del modelo User
const SeccionSchema = new schema({
   titulo: {
    type:String,
    required: true,
    unique: true
   },
   orden: {
    type: Number,
    required: true
   },
   activo:{
    type: Boolean,
    required: true,
    default: true
   },
   fechaRegistro: {
    type: Date, 
    default: Date.now
   },
   fechaModificacion: {
    type: Date, 
    default: Date.now
   },
   capitulos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Capitulo'
   }]

});

// Exportar el modelo User basado en el esquema UserSchema
export default mongoose.model('Seccion', SeccionSchema);



