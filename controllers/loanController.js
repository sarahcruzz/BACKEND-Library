const Loan = require('../models/loan')
const Book = require('../models/Book')

exports.createLoan = async (req, res) => {
    const { bookId } = req.body;
  
    try {
      const book = await Book.findById(bookId);
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Check if the book is already borrowed
      if (book.status === 'borrowed') {
        return res.status(400).json({ error: 'Book is already borrowed' });
      }
  
      // Update the book's status
      book.status = 'borrowed';
      await book.save();
  
      // Register the loan
      const loan = new Loan({
        userId: req.userId, // Associate with the authenticated user
        bookId: book._id,
        loanDate: new Date(),
      });
  
      await loan.save();
  
      res.status(201).json({ message: 'Book borrowed successfully', loan });
    } catch (error) {
      res.status(500).json({ error: 'Error borrowing the book' });
    }
};

exports.getActiveLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ status: 'borrowed' }).populate('bookId userId');
        res.json(loans);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar empréstimos ativos' });
    }
};

exports.returnBook = async (req, res) => {
    const { loanId } = req.params;

    try {
        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ error: 'Empréstimo não encontrado' });

        loan.status = 'returned';
        loan.returnDate = Date.now();
        await loan.save();

        res.json({ message: 'Livro devolvido com sucesso', loan });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao devolver livro' });
    }
};
