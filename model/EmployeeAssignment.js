const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const EmployeeAssignment = sequelize.define(
  'employee_assignment',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = EmployeeAssignment;
