require('dotenv').config()
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/books'); // Importando as rotas
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

// Configuração do CORS (Restrinja se necessário)
app.use(cors());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Middlewares
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// Configuração de inicialização do servidor
const PORT = process.env.PORT || 3000; // Suporte para variável de ambiente

// Exportar o app para testes
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}

module.exports = app;
