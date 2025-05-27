const User = require('../model/user');
const ManagerBank = require('../model/ManagerBank');

exports.createManagerBank = async (req, res) => {
  try {
    const {
      manager_id,
      ifsc,
      bank_name,
      account_type,
      branch_name,
      account_holder_name,
      account_no,
      upi
    } = req.body;

    const manager = await User.findByPk(manager_id);
    if (!manager || manager.role !== 'manager') {
      return res.status(400).json({ error: 'Invalid manager ID or role is not manager' });
    }

    const existing = await ManagerBank.findOne({ where: { manager_id } });
    if (existing) {
      return res.status(400).json({ error: 'Bank details already exist for this manager' });
    }

    const bank = await ManagerBank.create({
      manager_id,
      bank_name,
      account_type,
      ifsc,
      branch_name,
      account_holder_name,
      account_no,
      upi
    });

    res.status(201).json({ message: 'Manager bank details saved', data: bank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
