const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    titulo: { type: String, required: true},
    isbn: { type: String, required: true},
    genero: { type: String, required: true},
    imagem: { type: String, required: true},
    autor: { type: String, required: true},
    ano: { type: Number, required: true},
    descricao: { type: String, required: true},
    status: { 
        type: String, 
        enum: ['Disponível', 'Emprestado'], // Status do livro
        default: 'Disponível' // O livro começa disponível
    },
})

module.exports = mongoose.model('Book', BookSchema)