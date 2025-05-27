const LoanType = require('../model/LoanType');

exports.createLoanType = async (req, res) => {
  try {
    const { loan, description, icon, interest_rate } = req.body;

    const existingLoan = await LoanType.findOne({ where: { loan } });
    if (existingLoan) {
      return res.status(400).json({ message: 'Loan type already exists' });
    }

    const newLoanType = await LoanType.create({
      loan,
      description,
      icon,
      interest_rate,
    });

    res.status(201).json({ message: 'Loan type created', data: newLoanType });
  } catch (err) {
    console.error('Error creating loan type:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Optional: fetch all loan types
exports.getAllLoanTypes = async (req, res) => {
  try {
    const loanTypes = await LoanType.findAll();
    res.status(200).json({ data: loanTypes });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch loan types' });
  }
};
