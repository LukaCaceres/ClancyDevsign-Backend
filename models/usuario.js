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


// Hook pre-save para crear y asignar carrito y favoritos
UsuarioSchema.pre('save', async function (next) {
    try {
        // Crear un nuevo carrito
        const nuevoCarrito = new Carrito();
        // Guardar el carrito en la base de datos
        await nuevoCarrito.save();
        // Asignar el ID del carrito al usuario
        this.carrito = nuevoCarrito._id;

        // Crear nuevos favoritos
        const nuevosFavoritos = new Favorito();
        // Guardar los favoritos en la base de datos
        await nuevosFavoritos.save();
        // Asignar el ID de los favoritos al usuario
        this.favorito = nuevosFavoritos._id;

        // Continuar con el proceso de guardado
        next();
    } catch (error) {
        next(error); // Pasar el error al siguiente middleware
    }
});

//quitar datos extras en la respuesta JSON
UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);