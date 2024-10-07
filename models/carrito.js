const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    productos: [{
        producto: {type: Schema.Types.ObjectId, ref: 'Producto', require: [true, 'el producto es obligatorio']},
        cantidad: {type: Number, default: 1}
    }]
});

module.exports = model('Carrito', CarritoSchema);