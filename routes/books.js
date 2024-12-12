const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Book = require('../models/Book');
const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Rota para buscar livros pelo título (com correspondência parcial)
router.get('/search', async (req, res) => {
    try {
        const { titulo } = req.query;
        if (!titulo) {
            return res.status(400).json({ message: "O parâmetro 'titulo' é obrigatório." });
        }
        const books = await Book.find({ titulo: new RegExp(titulo, 'i') }); // Busca parcial (case-insensitive)
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar livros', error });
    }
});

// Rota para deletar um livro pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Livro não encontrado" });
        }
        res.status(200).json({ message: "Livro deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar livro", error });
    }
});

// Rota POST (criar livro)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { titulo, isbn, genero, autor, ano, descricao } = req.body;
        if (!titulo || !isbn || !genero || !autor || !ano || !descricao || !req.file) {
            return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
        }

        const imagem = req.file.path;

        const newBook = new Book({
            titulo,
            isbn,
            genero,
            imagem,
            autor,
            ano,
            descricao,
        });

        await newBook.save();
        res.status(201).json({ message: 'Livro cadastrado com sucesso', book: newBook });
    } catch (error) {
        console.error('Erro ao cadastrar livro:', error);
        res.status(500).json({ message: 'Erro ao cadastrar livro', error });
    }
});


// Rota GET (buscar todos os livros)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar os livros", error });
    }
});

// Rota GET (buscar livro por ID)
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Livro não encontrado" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao buscar o livro", error });
    }
});

// Rota PUT (atualizar livro por ID)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { titulo, isbn, genero, autor, ano, descricao } = req.body;
        const updateData = { titulo, isbn, genero, autor, ano, descricao };

        if (req.file) {
            updateData.imagem = req.file.path;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Livro não encontrado" });
        }

        res.status(200).json({ message: "Livro atualizado com sucesso", book: updatedBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar livro", error });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
        return res.status(404).json({ message: "Livro não encontrado" });
        }
        res.status(200).json({ message: "Livro deletado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar livro", error });
    }
    });

// Endpoint para dados dos usuários
router.get('/dashboard/users', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ active: true });
        const inactiveUsers = totalUsers - activeUsers;

        res.json({ totalUsers, activeUsers, inactiveUsers });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados dos usuários.' });
    }
});

// Endpoint para dados dos livros
router.get('/dashboard/books', async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments();
        const booksBorrowed = await Book.countDocuments({ status: 'borrowed' });
        const booksAvailable = totalBooks - booksBorrowed;

        res.json({ totalBooks, booksBorrowed, booksAvailable });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar dados dos livros.' });
    }
});



module.exports = router;

