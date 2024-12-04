const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const Book = require('../models/Book')
const router = express.Router()

// configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage})

// rota post (criar livro)
router.post('/', upload.single('image'), async (req, res) => {
    try{
        const { titulo, isbn, genero, autor, ano, descricao } = req.body
        const imagem = req.file.path

        const newBook = new Book({
            titulo,
            isbn, 
            genero, 
            imagem, 
            autor,
            ano,
            descricao 
        })

        await newBook.save()
        res.status(201).json({ message: 'Livro cadastrado com sucesso', book: newBook})
    } catch (error){
        res.status(500).json({ message: 'Erro ao cadastrar livro', error })
    }
})

// rota get (buscando todos os livros)
router.get("/", async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar os livros", error });
    }
  });
  
// Rota para pegar um livro específico pelo id
router.get("/:id", async (req, res) => {
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

// rota para atualização de um livro 
router.put("/:id", async (req, res) => {
    const { title, author, year } = req.body;

    try {
        const updatedBook = await Book.findByIdAndUpdate()(
            req.params.id,
            { title, author, year },
            { new: true }
        );
        if (!updatedBook) {
        return res.status(404).json({ message: "Livro não encontrado" });
        }
        res.status(200).json(updatedBook);
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


module.exports = router