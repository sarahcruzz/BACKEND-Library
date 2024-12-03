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

module.exports = router