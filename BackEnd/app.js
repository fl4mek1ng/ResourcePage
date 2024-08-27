'use strict';

// Cargar módulos de node para crear servidor
import express from "express";
import UsuarioRouter from "../BackEnd/routes/UsuarioRoute.js";
// Ejecutar express (http)
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Método o Ruta de prueba para el API
app.use('/api/', UsuarioRouter);

// Exportar módulo (fichero actual)
export default app;
