const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const Rol = require('../models/rol');

const esRolValido = async (rol = '') => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}


// Verificar si el correo ya existe en la base de datos
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
};

// Verificar si el usuario existe por su ID
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario con el ID ${id} no existe`);
    }
};

// Verificar si el producto existe por su ID
const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con el ID ${id} no existe`);
    }
};


module.exports = {
    existeProductoPorId,
    emailExiste,
    existeUsuarioPorId,
    esRolValido,
};
