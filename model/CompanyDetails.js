const {DataTypes} = require('sequelize');
const sequelize = require('../config/database')

const CompanyDetails = sequelize.define('company_details', {
    websiteName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      websiteUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      whatsapp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      webAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      companyAddress: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      gst: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastUpdate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
});

module.exports = CompanyDetails;

  