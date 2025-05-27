// controllers/employeeStateController.js
const EmployeeState = require('../model/EmployeeState');
const Employee = require('../model/employee');
const User = require('../model/user');

// Assign one or more states to an employee
exports.assignStatesToEmployee = async (req, res) => {
    try {
      const { employeeId, states } = req.body;
  
      if (!Array.isArray(states) || states.length === 0) {
        return res.status(400).json({ error: 'States must be a non-empty array' });
      }
  
      const employee = await Employee.findOne({ where: { employeeId } });
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Avoid duplicate entries
      const existingStates = await EmployeeState.findAll({
        where: { employeeId },
      });
      const existingStateValues = existingStates.map(s => s.assignedState);
  
      const newStates = states
        .filter(state => !existingStateValues.includes(state))
        .map(state => ({ employeeId, assignedState: state }));
  
      if (newStates.length === 0) {
        return res.status(200).json({ message: 'No new states to assign. All already exist.' });
      }
  
      const inserted = await EmployeeState.bulkCreate(newStates);
      res.status(200).json({ message: 'States assigned successfully.', data: inserted });
  
    } catch (err) {
      console.error('Assign States Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Get states assigned to a specific employee
exports.getStatesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const states = await EmployeeState.findAll({
      where: { employeeId },
      attributes: ['state']
    });

    res.status(200).json(states.map(row => row.state));
  } catch (err) {
    console.error('Get States Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all employees assigned to a specific state
exports.getEmployeesByState = async (req, res) => {
  try {
    const { state } = req.params;

    const employees = await EmployeeState.findAll({
      where: { state },
      include: {
        model: Employee,
        as: 'Employee',
        attributes: ['id', 'name', 'email'] // adjust fields as needed
      }
    });

    res.status(200).json(employees);
  } catch (err) {
    console.error('Get Employees By State Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
