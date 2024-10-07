const { request, response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

// Crear un nuevo usuario (Registro)
const usuarioPOST = async (req = request, res = response) => {
    const { nombre, correo, password, rol } = req.body;

    try {
        // Crear un nuevo usuario
        const usuario = new Usuario({ nombre, correo, password, rol });

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        // Guardar en la base de datos
        await usuario.save();

        res.status(201).json({
            msg: 'Usuario creado correctamente',
            usuario
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Obtener todos los usuarios
const usuariosGET = async (req = request, res = response) => {
    const {desde = 0, limite = 10 } = req.query;

    try {
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments({ estado: true }),
            Usuario.find({ estado: true })
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Obtener un usuario por ID
const usuarioGET = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findById(id);
        if (!usuario || !usuario.estado) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Actualizar un usuario
const usuarioPUT = async (req = request, res = response) => {
    const { id } = req.params;
    const { password, ...resto } = req.body;

    try {
        // Verificar si el usuario está activo
        const usuario = await Usuario.findById(id);
        if (!usuario.estado) {
            return res.status(400).json({ msg: 'Usuario no encontrado o inactivo' });
        }

        // Encriptar la nueva contraseña si es proporcionada
        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        // Actualizar el usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto, { new: true });

        res.json({
            msg: 'Usuario actualizado correctamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

// Eliminar un usuario (soft delete)
const usuarioDELETE = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.json({
            msg: 'Usuario eliminado correctamente',
            usuario
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

module.exports = {
    usuarioPOST,
    usuariosGET,
    usuarioGET,
    usuarioPUT,
    usuarioDELETE
};
