const Manager = require('../model/manager');

exports.createManager = async (req, res) => {
  try {
    const { userId, nickName, department, status } = req.body;
    const manager = await Manager.create({ userId, nickName, department, status });

    res.status(201).json({ message: 'Manager created', manager });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
