// models/loan.js
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    loanDate: { type: Date, default: Date.now },
    returnDate: { type: Date }, // Preenchido quando o livro é devolvido
    status: { type: String, enum: ['borrowed', 'returned'], default: 'borrowed' },
});

module.exports = mongoose.model('Loan', loanSchema);
