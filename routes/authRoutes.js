const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/getAllUsers', authController.getAllUsers)
router.get('/getUserById', authController.getUserById)

module.exports = router