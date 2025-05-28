const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || 'yoursecretKey';
const bcrypt = require('bcryptjs');
const moment = require('moment');
const {
  User,
  UserLoan,
  UserInformation,
  UserAddress,
  UserBank,
  EmployeeAssignment,
  Employee,
} = require('../model');
const EmployeeState = require('../model/EmployeeState');

// Create a user (admin, manager, employee, or general user)
// updateIsrentedStatus
exports.updateIsrentedStatus = async (req, res) => {
  try {
    const { empId, rented_status } = req.body;

    const user = await User.findByPk(empId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isrented = rented_status;
    await user.save();

    res.status(200).json({ message: 'isrented status updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, mobileNumber, email, role, password, managerId, status } =
      req.body;

    // If user is employee, managerId is required
    if (role === 'employee' && !managerId) {
      return res
        .status(400)
        .json({ error: 'managerId is required for employees' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      mobileNumber,
      email,
      role,
      password: hashedPassword,
      managerId: role === 'employee' ? managerId : null,
      status: status || 'Active',
    });

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({
      where: { id },
      include: [
        { model: UserInformation, as: 'user_information' },
        { model: UserAddress, as: 'user_address' },
        { model: UserLoan, as: 'user_loan' },
        { model: UserBank, as: 'user_bank' },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getManagers = async (req, res) => {
  try {
    const managers = await User.findAll({
      where: {
        role: 'manager',
      },
      attributes: ['id', 'name'], // Only send needed fields
    });

    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getManagersWithEmployees = async (req, res) => {
//   try {
//     const managers = await User.findAll({
//       where: { role: 'manager' },
//       attributes: ['id', 'name', 'email', 'mobileNumber', 'status'],
//       include: [
//         {
//           model: User,
//           as: 'Employees',
//           attributes: ['id', 'name', 'managerId'], // add lead stats if needed
//         }
//       ]
//     });

// Optionally calculate lead stats here if needed
//     const enriched = managers.map(manager => ({
//       ...manager.toJSON(),
//       totalEmployees: manager.Employees.length,
//       totalLeads: 10,
//       todaysLeads: 2,
//     }));

//     res.json(enriched);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getManagersWithEmployees = async (req, res) => {
  try {
    const managers = await User.findAll({
      where: { role: 'manager' },
      attributes: ['id', 'name', 'email', 'mobileNumber', 'status'],
      include: [
        {
          model: User,
          as: 'Employees',
          attributes: ['id', 'name', 'managerId', 'status'],
        },
      ],
    });

    const enriched = await Promise.all(
      managers.map(async (manager) => {
        const employeeIds = manager.Employees.map((emp) => emp.id);

        // Fetch all leads for this manager’s employees
        const leads = await EmployeeAssignment.findAll({
          where: {
            employee_id: { [Op.in]: employeeIds },
          },
          attributes: ['employee_id', 'createdAt'],
        });

        // Calculate today's date
        const today = moment().startOf('day');

        // Group by employee
        const leadCountMap = {};
        leads.forEach((lead) => {
          const eid = lead.employee_id;
          const isToday = moment(lead.createdAt).isSame(today, 'day');

          if (!leadCountMap[eid]) {
            leadCountMap[eid] = { total: 0, today: 0 };
          }

          leadCountMap[eid].total += 1;
          if (isToday) {
            leadCountMap[eid].today += 1;
          }
        });

        // Add stats to each employee
        const employeesWithStats = manager.Employees.map((emp) => {
          const stats = leadCountMap[emp.id] || { total: 0, today: 0 };
          return {
            ...emp.toJSON(),
            totalLeads: stats.total,
            todaysLeads: stats.today,
          };
        });

        const totalLeads = employeesWithStats.reduce(
          (acc, emp) => acc + emp.totalLeads,
          0
        );
        const todaysLeads = employeesWithStats.reduce(
          (acc, emp) => acc + emp.todaysLeads,
          0
        );

        return {
          ...manager.toJSON(),
          Employees: employeesWithStats,
          totalEmployees: employeesWithStats.length,
          totalLeads,
          todaysLeads,
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error('Error in getManagersWithEmployees:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or mobile number',
        status: '0',
        success: false,
        error: true,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid password',
        status: '0',
        success: false,
        error: true,
      });
    }

    // 🔐 Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Login successful',
      status: '1',
      success: true,
      error: false,
      data: user,
      token, // ✅ return token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getUserByMobile = async (req, res) => {
  const mobileNumber = req.params.mobileNumber;
  try {
    const user = await User.findOne({
      where: { mobileNumber },
      include: [
        { model: UserInformation, as: 'user_information' },
        { model: UserAddress, as: 'user_address' },
        { model: UserLoan, as: 'user_loan' },
        { model: UserBank, as: 'user_bank' },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({
      where: { id },
      include: [
        { model: UserInformation, as: 'user_information' },
        { model: UserAddress, as: 'user_address' },
        { model: UserLoan, as: 'user_loan' },
        { model: UserBank, as: 'user_bank' },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getEmployeesByManager = async (req, res) => {
  const { managerId } = req.query;
  try {
    const employees = await User.findAll({
      where: {
        role: 'employee',
        managerId: managerId,
      },
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeesByManagerWithData = async (req, res) => {
  const { managerId } = req.query;

  if (!managerId) {
    return res.status(400).json({ status: 0, error: 'Manager ID is required' });
  }

  try {
    const employees = await User.findAll({
      where: {
        role: 'employee',
        managerId: managerId,
      },
      attributes: [
        'id',
        'name',
        'email',
        'mobileNumber',
        'status',
        'managerId',
      ],
      include: [
        {
          model: User,
          as: 'Manager',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: EmployeeAssignment,
          as: 'assigned_employee',
          include: [
            {
              model: User,
              as: 'User',
              include: [
                { model: UserInformation, as: 'user_information' },
                { model: UserAddress, as: 'user_address' },
                { model: UserLoan, as: 'user_loan' },
                { model: UserBank, as: 'user_bank' },
              ],
            },
          ],
        },
        {
          model: Employee,
          as: 'employeeLeads',
          include: [
            {
              model: EmployeeState,
              as: 'States',
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: 'Employees by manager with full data fetched successfully',
      status: 1,
      data: employees,
    });
  } catch (error) {
    console.error('Error fetching employees by manager:', error);
    res.status(500).json({ status: 0, error: error.message });
  }
};

exports.getAllEmployeesWithData = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: 'employee' },
      attributes: [
        'id',
        'name',
        'email',
        'mobileNumber',
        'status',
        'managerId',
        'isrented',
      ],
      include: [
        {
          model: User,
          as: 'Manager',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: EmployeeAssignment,
          as: 'assigned_employee',
          include: [
            {
              model: User,
              as: 'User',
              include: [
                { model: UserInformation, as: 'user_information' },
                { model: UserAddress, as: 'user_address' },
                { model: UserLoan, as: 'user_loan' },
                { model: UserBank, as: 'user_bank' },
              ],
            },
          ],
        },
        {
          model: Employee,
          as: 'employeeLeads',
          include: [
            {
              model: EmployeeState,
              as: 'States',
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: 'Employees with full data fetched successfully',
      status: 1,
      data: employees,
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ status: 0, error: error.message });
  }
};
