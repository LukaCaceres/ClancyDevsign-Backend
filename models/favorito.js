const { Schema, model } = require('mongoose');

const FavoritoSchema = Schema({
    productos: [{
        producto: {type: Schema.Types.ObjectId, ref: 'Producto', require: [true, 'el producto es obligatorio']},
    }],
});

module.exports = model('Favorito', FavoritoSchema);