const User = require('../model/user');
const UserAddress = require('../model/UserAddress');
const UserBank = require('../model/UserBank');
const UserLoan = require('../model/UserLoan');
const UserInformation = require('../model/UserInformation');

exports.createUserAddress = async (req, res) => {
  try {
    const { user_id, pincode, city, state, address } = req.body;

    const user = await User.findByPk(user_id);
    if (!user || user.role !== 'user') {
      return res.status(400).json({ error: 'Invalid user or role is not user' });
    }

    const data = await UserAddress.create({ user_id, pincode, city, state, address });
    res.status(201).json({ message: 'Address saved', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createUserBank = async (req, res) => {
  try {
    const { user_id, bank_name, account_type, ifsc, branch_name, account_holder_name, account_no } = req.body;
    const user = await User.findByPk(user_id);
    if (!user || user.role !== 'user') {
      return res.status(400).json({ error: 'Invalid user or role is not user' });
    }

    const data = await UserBank.create({ user_id, bank_name, account_type, ifsc, branch_name, account_holder_name, account_no });
    res.status(201).json({ message: 'Bank details saved', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createUserLoan = async (req, res) => {
  try {
    const { user_id, loan_type, amount, tenure, interest_rate, emi } = req.body;
    const user = await User.findByPk(user_id);
    if (!user || user.role !== 'user') {
      return res.status(400).json({ error: 'Invalid user or role is not user' });
    }

    const data = await UserLoan.create({ user_id, loan_type, amount, tenure, interest_rate, emi });
    res.status(201).json({ message: 'Loan data saved', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createUserInformation = async (req, res) => {
  try {
    const { user_id, aadhar, pancard, whatsapp_no, dob, employement, gender } = req.body;
    const user = await User.findByPk(user_id);
    if (!user || user.role !== 'user') {
      return res.status(400).json({ error: 'Invalid user or role is not user' });
    }

    const data = await UserInformation.create({ user_id, aadhar, pancard, whatsapp_no, dob, employement, gender });
    res.status(201).json({ message: 'User information saved', data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
