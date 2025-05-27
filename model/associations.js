const Employee = require('./employee');
const EmployeeState = require('./EmployeeState');

// Now that both are defined, we can safely associate
Employee.hasMany(EmployeeState, {
  foreignKey: 'employeeId',
  as: 'states',
});
EmployeeState.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee',
});