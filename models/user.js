const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true // Usuário ativo por padrão
    }
}, {
    timestamps: true // Adiciona campos createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('User', userSchema);
