const Carrito = require('./carrito');
const Favorito = require('./favorito');
const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    correo: { type: String, required: [true, 'El correo es obligatorio'], unique: true },
    password: { type: String, required: [true, 'El contraseña es obligatoria'] },
    carrito: { type: Schema.Types.ObjectId, ref: 'Carrito' },
    favorito: { type: Schema.Types.ObjectId, ref: 'Favorito' },
    rol: { type: String, required: true, default: 'USER_ROLE' },
    estado: { type: Boolean, default: true },
    resetToken: { type: String, default: "" }
});

// Hook pre-save para crear y asignar carrito y favoritos solo en la creación del usuario
UsuarioSchema.pre('save', async function (next) {
    // Verificamos si el documento es nuevo para evitar la creación de carritos/favoritos en cada actualización
    if (this.isNew) {
        try {
            // Crear un nuevo carrito y asignar el usuario al carrito
            const nuevoCarrito = new Carrito({ usuario: this._id, productos: [] });
            await nuevoCarrito.save();
            this.carrito = nuevoCarrito._id;

            // Crear nuevos favoritos y asignar el usuario a favoritos
            const nuevosFavoritos = new Favorito({ usuario: this._id, productos: [] });
            await nuevosFavoritos.save();
            this.favorito = nuevosFavoritos._id;

            next(); // Continuar con el proceso de guardado
        } catch (error) {
            next(error); // Pasar el error al siguiente middleware
        }
    } else {
        next(); // Si no es un documento nuevo, pasar al siguiente middleware sin crear carrito/favoritos
    }
});

//quitar datos extras en la respuesta JSON
UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
};
module.exports = model('Usuario', UsuarioSchema);