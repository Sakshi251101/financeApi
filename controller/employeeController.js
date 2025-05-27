const  Employee = require('../model/employee');
const User = require('../model/user');

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // 1. Validate employee exists and is an 'employee'
    const employeeUser = await User.findByPk(employeeId);
    if (!employeeUser || employeeUser.role !== 'employee') {
      return res.status(400).json({ error: 'Invalid employeeId or role is not employee' });
    }

    // 2. Validate manager exists and is a 'manager' (if provided)
    if (req.body.managerId) {
      const managerUser = await User.findByPk(req.body.managerId);
      if (!managerUser || managerUser.role !== 'manager') {
        return res.status(400).json({ error: 'Invalid managerId or role is not manager' });
      }
    }

    // 3. Check if the employee already exists
    const existingEmployee = await Employee.findOne({ where: { employeeId } });

    if (existingEmployee) {
      const allowedFields = ['priority', 'dailyAssigned'];
      const updateData = {};

      for (const field of allowedFields) {
        if (
          Object.hasOwn(req.body, field) &&
          req.body[field] !== null &&
          req.body[field] !== undefined
        ) {
          updateData[field] = req.body[field];
        }
      }

      // Prevent empty update
      if (Object.keys(updateData).length > 0) {
        await existingEmployee.update(updateData);

        // Reload fresh data from DB to avoid stale data issue
        await existingEmployee.reload();
      }

      return res.status(200).json({
        message: 'Employee updated successfully',
        data: existingEmployee,
      });
    }

    // 4. Create new employee
    const newEmployee = await Employee.create({
      employeeId: req.body.employeeId,
      managerId: req.body.managerId ?? null,
      priority: req.body.priority ?? null,
      leads: req.body.leads ?? null,
      dailyAssigned: req.body.dailyAssigned ?? null,
      status: req.body.status ?? 'Active',
    });

    return res.status(201).json({
      message: 'Employee created successfully',
      data: newEmployee,
    });

  } catch (error) {
    console.error('Error creating/updating employee:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



// Get All Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: User, as: 'UserInfo', foreignKey: 'employeeId' }
      ]
    });
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
