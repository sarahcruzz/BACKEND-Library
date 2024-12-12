const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/create', loanController.createLoan);
router.get('/active', loanController.getActiveLoans);
router.post('/return/:loanId', loanController.returnBook);

module.exports = router;
