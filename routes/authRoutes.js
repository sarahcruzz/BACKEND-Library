const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/getAllUsers', authController.getAllUsers)
router.get('/getUserById', authController.getUserById)
router.patch('/activateUser/:id', authController.activateUser);
router.patch('/deactivateUser/:id', authController.deactivateUser);


module.exports = router