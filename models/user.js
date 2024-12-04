const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

// Corrigir a linha abaixo para usar module.exports em vez de MediaSourceHandle.exports
module.exports = mongoose.model('User', userSchema)
