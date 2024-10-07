const Producto = require('../models/producto');

// Verificar si el producto existe por su ID
const existeProductoPorId = async (id) => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto con el ID ${id} no existe`);
    }
};

module.exports = {
    existeProductoPorId
};
