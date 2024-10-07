const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const usuarioPost = async (req = request, res = response) => {
    try {
        // Recibir el cuerpo de la petición
        const datos = req.body;
        const { nombre, correo, password } = datos;
        const usuario = new Usuario({ nombre, correo, password });

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        usuario.password = hash;

        // Guardar en la BD
        await usuario.save();

        res.json({
            mensaje: "Usuario creado correctamente",
            usuario
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ mensaje: "Error al crear usuario" });
    }
};

const usuariosGet = async (req = request, res = response) => {
    try {
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(),
            Usuario.find()
        ]);

        res.json({
            mensaje: 'Usuarios obtenidos',
            total,
            usuarios
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

const usuariosActivosGet = async (req = request, res = response) => {
    try {
        const query = { estado: true };
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.find(query)
        ]);

        res.json({
            mensaje: 'Usuarios obtenidos',
            total,
            usuarios
        });
    } catch (error) {
        console.error("Error al obtener usuarios activos:", error);
        res.status(500).json({ mensaje: "Error al obtener usuarios activos" });
    }
};

const usuarioGet = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Buscar el usuario
        const usuario = await Usuario.findById(id);

        if (!usuario) {
            res.status(401).json({
                mensaje: 'El usuario no existe',
            });
        }

        res.json({
            mensaje: 'Usuario obtenido correctamente',
            usuario
        });
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ mensaje: "Error al obtener usuario" });
    }
};

const usuarioPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Obtener datos para actualizar
        const { password, ...resto } = req.body;

        // Si actualiza la contraseña, hay que cifrarla o encriptarla
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(password, salt);
        }

        // Buscar el usuario y actualizarlo
        const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

        res.json({
            mensaje: 'Usuario actualizado correctamente',
            usuario
        });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ mensaje: "Error al actualizar usuario" });
    }
};

const usuarioDelete = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        // Para cambiar el estado a false
        const usuario = await Usuario.findById(id);

        if (!usuario.estado) {
            return res.json({
                mensaje: "El usuario no existe"
            });
        }

        const usuarioInactivado = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.json({
            mensaje: 'Usuario borrado correctamente',
            usuarioInactivado
            // usuarioBorrado
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ mensaje: "Error al eliminar usuario" });
    }
};

module.exports = {
    usuarioPost,
    usuariosGet,
    usuariosActivosGet,
    usuarioGet,
    usuarioPut,
    usuarioDelete
};