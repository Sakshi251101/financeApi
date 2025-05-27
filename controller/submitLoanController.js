const { Op } = require('sequelize');
const EmployeeState = require('../model/EmployeeState');
const sequelize = require('../config/database');
const { sendUserEmail, sendEmployeeEmail } = require('../utils/mailer');
const generateReferenceIds = require('../utils/referenceGenerator');
const generateRandomPassword = require('../utils/passwordGenerator');
const {
  User,
  UserLoan,
  UserInformation,
  UserAddress,
  UserBank,
  UserLoanReferenceIds,
  EmployeeAssignment,
  Employee,
  ManagerBank,
} = require('../model');

exports.submitLoanApplication = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      name,
      email,
      whatsAppNumber,
      mobileNumber,
      dob,
      gender,
      employment,
      aadhar,
      pan,
      address,
      pincode,
      city,
      state,
      rentedAddress,
      rentedPincode,
      rentedCity,
      rentedState,
      isRented,
      loanAmount,
      loanPurpose,
      bankName,
      accountNumber,
      ifsc,
      accountType,
      accountHolderName,
      branchName,
      loanTenure,
      interestRate,
      emi,
    } = req.body;
    // const user = await User.finAll(where.isRented=1);
    // if(user.isRented==1){

    // }

    const randomPassword = generateRandomPassword();

    const user = await User.create(
      {
        name,
        email,
        mobileNumber,
        password: randomPassword,
        role: 'user',
        status: 'Active',
      },
      { transaction: t }
    );

    const userInfo = await UserInformation.create(
      {
        user_id: user.id,
        dob,
        gender,
        employement: employment,
        aadhar,
        pancard: pan,
        whatsapp_no: whatsAppNumber,
      },
      { transaction: t }
    );

    const permanentAddress = await UserAddress.create(
      {
        user_id: user.id,
        address,
        pincode,
        city,
        state,
        address_type: 'permanent',
      },
      { transaction: t }
    );
    // If rented is selected
    let rentedAddressEntry = null;
    if (isRented==="2") {
      rentedAddressEntry = await UserAddress.create(
        {
          user_id: user.id,
          address: rentedAddress,
          pincode: rentedPincode,
          city: rentedCity,
          state: rentedState,
          address_type: 'rented',
        },
        { transaction: t }
      );
    }

    const loanData = await UserLoan.create(
      {
        user_id: user.id,
        loan_type: loanPurpose,
        amount: loanAmount,
        tenure: loanTenure,
        interest_rate: interestRate,
        emi,
      },
      { transaction: t }
    );

    const bankDetails = await UserBank.create(
      {
        user_id: user.id,
        bank_name: bankName,
        account_type: accountType,
        account_no: accountNumber,
        branch_name: branchName,
        account_holder_name: accountHolderName,
        ifsc,
      },
      { transaction: t }
    );

    const ids = generateReferenceIds(user.id);
    const loanReferenceIds = await UserLoanReferenceIds.create(
      {
        user_id: user.id,
        ...ids,
      },
      { transaction: t }
    );

    // Fetch active employees with priority, and their states
    const employees = await Employee.findAll({
      where: {
        status: 'Active',
        [Op.and]: sequelize.literal(
          'COALESCE(leads, 0) < COALESCE(dailyAssigned, 5)'
        ),
      },
      include: [
        {
          association: 'UserInfo', // Make sure this association is defined in model
          where: { status: 'Active' },
          required: true,
          include: [
            {
              association: 'Manager', // Make sure this is correctly defined in User model
              where: { status: 'Active' },
              required: false,
              include: [
                {
                  model: ManagerBank,
                  as: 'manager_bank',
                  required: false,
                },
              ],
            },
          ],
        },
        {
          model: EmployeeState,
          as: 'States',
          required: false,
        },
      ],
      order: [['priority', 'ASC']],
      transaction: t,
    });

    if (!employees.length) throw new Error('No available employees.');

    // Step: Choose an eligible employee
    let selectedEmployee = null;

    const stateMatchedEmployees = employees.filter((emp) => {
      const assignedStates = emp.States.map((s) => s.assignedState);
      return assignedStates.includes(state) && emp.leads < emp.dailyAssigned;
    });

    if (stateMatchedEmployees.length > 0) {
      selectedEmployee = stateMatchedEmployees[0];
    } else {
      const availableEmployees = employees.filter(
        (emp) => emp.leads < emp.dailyAssigned
      );
      if (availableEmployees.length > 0) {
        selectedEmployee = availableEmployees[0];
      }
    }

    if (!selectedEmployee) {
      throw new Error('No eligible employee found.');
    }

    selectedEmployee.leads = (selectedEmployee.leads || 0) + 1;
    await selectedEmployee.save({ transaction: t });

    await EmployeeAssignment.create(
      {
        user_id: user.id,
        employee_id: selectedEmployee.employeeId,
      },
      { transaction: t }
    );

    const employeeUser = selectedEmployee.UserInfo;
    const manager = employeeUser?.Manager;
    const managerBank = manager?.manager_bank;

    console.log('Assigned Manager:', {
      name: manager?.name,
      email: manager?.email,
      phone: manager?.mobileNumber,
      bankDetails: managerBank
        ? {
            bankName: managerBank.bank_name,
            accountNo: managerBank.account_no,
            ifsc: managerBank.ifsc,
            upi: managerBank.upi,
          }
        : 'No bank details found',
    });

    // Send email to user
    await sendUserEmail(email, {
      userPhone: mobileNumber,
      userPassword: user.password,
      userEmail: email,
      employeeName: employeeUser.name,
      employeeEmail: employeeUser.email,
      employeePhone: employeeUser.mobileNumber,
      whatsapp: employeeUser.mobileNumber,
    });

    await t.commit();

    res.status(201).json({
      message: 'Loan Application Submitted',
      data: {
        user,
        userInfo,
        // userAddress,
        userAddress: {
          permanent: permanentAddress,
          rented: rentedAddressEntry,
        },
        loanData,
        bankDetails,
        loanReferenceIds,
      },
      assignedEmployee: {
        name: employeeUser.name,
        email: employeeUser.email,
        phone: employeeUser.mobileNumber,
        whatsapp: employeeUser.mobileNumber,
      },
      assignedManager: manager
        ? {
            id: manager.id,
            name: manager.name,
            email: manager.email,
            phone: manager.mobileNumber,
            bankDetails: managerBank
              ? {
                  bankName: managerBank.bank_name,
                  accountType: managerBank.account_type,
                  accountHolder: managerBank.account_holder_name,
                  accountNo: managerBank.account_no,
                  ifsc: managerBank.ifsc,
                  upi: managerBank.upi,
                  branch: managerBank.branch_name,
                }
              : null,
          }
        : null,
      redirectWhatsapp: `https://wa.me/91${
        employeeUser.mobileNumber
      }?text=${encodeURIComponent(
        `🔔 New Loan Application Assigned\n\n📌 Name: ${name}\n📧 Email: ${email}\n📱 Phone: ${mobileNumber}\n💬 WhatsApp: ${whatsAppNumber}\n💰 Loan Amount: ₹${loanAmount}\n🎯 Purpose: ${loanPurpose}`
      )}`,
    });
  } catch (err) {
    await t.rollback();
    console.error('Submit Loan Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
exports.getUserLoanApplication = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [
        { model: UserInformation, as: 'user_information' },
        { model: UserAddress, as: 'user_address' },
        { model: UserLoan, as: 'user_loan' },
        { model: UserBank, as: 'user_bank' },
        { model: UserLoanReferenceIds, as: 'loanReference' },
        {
          model: EmployeeAssignment,
          as: 'assigned_employee',
          include: [
            {
              model: User,
              as: 'AssignedEmployee',
              include: [
                {
                  model: User,
                  as: 'Manager',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Fetch User Application Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUsersAssignedToEmployee = async (req, res) => {
  const { id, role } = req.user;

  if (role !== 'employee') {
    return res.status(403).json({ status: 0, message: 'Access denied' });
  }

  const assignments = await EmployeeAssignment.findAll({
    where: { employee_id: id },
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
  });

  res.status(200).json({ status: 1, data: assignments });
};

exports.getLeads = async (req, res) => {
  try {
    const allLeads = await EmployeeAssignment.findAll({
      include: [
        {
          model: User,
          as: 'user',
          include: [
            { model: UserInformation, as: 'user_information' },
            { model: UserAddress, as: 'user_address' },
            { model: UserLoan, as: 'user_loan' },
            { model: UserBank, as: 'user_bank' },
          ],
        },
      ],
    });
    res.status(200).json({
      message: 'Leads fetched successfully',
      error: false,
      status: 1,
      data: allLeads,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'internal server error', error: error.message });
  }
};

exports.fetchLeadsByManager = async (req, res) => {
  const managerId = req.user.id; // logged-in manager's ID from token

  try {
    const employees = await Employee.findAll({
      where: { managerId },
      attributes: ['employeeId'],
    });

    const employeeIds = employees.map((emp) => emp.employeeId);

    if (employeeIds.length === 0) {
      return res
        .status(404)
        .json({ message: 'No employees found under this manager.' });
    }

    const leads = await EmployeeAssignment.findAll({
      where: { employee_id: employeeIds },
      include: [
        {
          model: User,
          as: 'User',
          include: [
            { model: UserInformation },
            { model: UserAddress },
            { model: UserLoan },
            { model: UserBank },
          ],
        },
        {
          model: User,
          as: 'AssignedEmployee',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.status(200).json({
      message: `Manager's leads fetched successfully`,
      status: 1,
      error: false,
      data: leads,
    });
  } catch (error) {
    console.error('Error fetching leads by managerId:', error);
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message });
  }
};
