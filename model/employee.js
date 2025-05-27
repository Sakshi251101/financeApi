const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Employee = sequelize.define(
  'Employee',
  {
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    managerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    dailyAssigned: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive'),
      defaultValue: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Employee;
