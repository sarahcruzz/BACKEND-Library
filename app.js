const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/books'); // Importando as rotas
const authRoutes = require('./routes/authRoutes')
const path = require('path');

const app = express();

// Ativar o CORS para todas as origens (ou você pode restringir para uma URL específica)
app.use(cors());

// Conexão com MongoDB (sem as opções obsoletas)
mongoose.connect('mongodb+srv://root:root@library.lgycr.mongodb.net/library?retryWrites=true&w=majority')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

// Rotas
app.use('/api/books', bookRoutes); // Configuração das rotas
app.use('/api/auth', authRoutes)

// Inicializando o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
