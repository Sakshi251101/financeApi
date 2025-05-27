// models/EmployeeState.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Employee = require('./employee');

const EmployeeState = sequelize.define('employee_states', {
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Employees', // Points to employee model
      key: 'employeeId',  // Not the primary 'id' field
    },
  },
  assignedState: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['employeeId', 'assignedState'],
    }
  ]
});

// Association
EmployeeState.belongsTo(Employee, { foreignKey: 'employeeId', targetKey: 'employeeId', as: 'Employee' });
Employee.hasMany(EmployeeState, { foreignKey: 'employeeId', sourceKey: 'employeeId', as: 'States' });

module.exports = EmployeeState;
