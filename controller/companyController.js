
const CompanyDetails = require('../model/CompanyDetails');


exports.upsertCompanyDetails = async (req, res) => {
  try {
    const data = req.body;

    const existing = await CompanyDetails.findOne();

    if (existing) {
      await existing.update({ ...data, lastUpdate: new Date() });
      return res.status(200).json({ message: 'Company details updated', data: existing });
    }

    const newDetails = await CompanyDetails.create({ ...data });
    res.status(201).json({ message: 'Company details created', data: newDetails });
  } catch (error) {
    console.error('Error in upsertCompanyDetails:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get company details
exports.getCompanyDetails = async (req, res) => {
  try {
    const details = await CompanyDetails.findOne();
    if (!details) {
      return res.status(404).json({ message: 'No company details found' });
    }
    res.status(200).json(details);
  } catch (error) {
    console.error('Error in getCompanyDetails:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
