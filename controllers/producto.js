const { request, response } = require('express');
const Producto = require('../models/producto');

// Crear un nuevo producto
const productoPOST = async (req = request, res = response) => {
    const { nombre, descripcion, categoria, precio, imagenes } = req.body;

    try {
        // Verificar si ya existe un producto con el mismo nombre
        const productoExistente = await Producto.findOne({ nombre: nombre.toUpperCase() });
        if (productoExistente) {
            return res.status(400).json({
                msg: `El producto ${nombre} ya existe.`
            });
        }

        // Crear el producto con los datos enviados
        const producto = new Producto({
            nombre: nombre.toUpperCase(),
            descripcion,
            categoria: categoria.toUpperCase(),
            precio,
            imagenes
        });

        // Guardar en la base de datos
        await producto.save();

        res.status(201).json({
            msg: 'Producto creado correctamente',
            producto
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ msg: 'Error al crear el producto' });
    }
};

// Obtener todos los productos con paginación
const productosGET = async (req = request, res = response) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { activo: true };

    try {
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.json({
            total,
            productos
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ msg: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
const productoGET = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto || !producto.activo) {
            return res.status(404).json({ msg: 'Producto no encontrado o inactivo' });
        }

        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ msg: 'Error al obtener el producto' });
    }
};

// Actualizar un producto
const productoPUT = async (req = request, res = response) => {
    const { id } = req.params;
    const { ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    if (data.categoria) {
        data.categoria = data.categoria.toUpperCase();
    }

    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.json({
            msg: 'Producto actualizado correctamente',
            productoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto (Soft Delete)
const productoDELETE = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const productoEliminado = await Producto.findByIdAndUpdate(id, { activo: false }, { new: true });
        if (!productoEliminado) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        res.json({
            msg: 'Producto eliminado correctamente',
            productoEliminado
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
};

module.exports = {
    productoPOST,
    productosGET,
    productoGET,
    productoPUT,
    productoDELETE
};
