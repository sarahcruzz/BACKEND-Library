const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Book = require('../models/Book');

describe('Rota de Adição de Livros', () => {
    // Limpeza do banco antes e depois dos testes
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI)
    });

    // beforeEach(async () => {
    //     await Book.deleteMany(); // Limpa a coleção antes de cada teste
    // });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('Deve adicionar um novo livro', async () => {
        const response = await request(app)
            .post('/api/books')
            .field('titulo', 'Test Book')
            .field('isbn', '123456789')
            .field('genero', 'Ficção')
            .field('autor', 'Autor Teste')
            .field('ano', 2023)
            .field('descricao', 'Descrição do livro de teste')
            .attach('image', 'C:/Users/sarah/Downloads/gatinho.jpg'); // Envie o arquivo como esperado pela rota
    
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Livro cadastrado com sucesso');
        expect(response.body.book).toHaveProperty('_id');
        expect(response.body.book.titulo).toBe('Test Book');
    });
    

    it('Deve falhar ao tentar adicionar um livro sem os campos obrigatórios', async () => {
        const response = await request(app)
            .post('/api/books')
            .send({}); // Envia um objeto vazio para validar campos obrigatórios

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Campos obrigatórios ausentes');
    });
});
