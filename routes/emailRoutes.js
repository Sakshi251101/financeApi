const express = require('express');
const router = express.Router();
const { sendEmail, paidMail } = require('../controller/emailController'); //

router.post('/send-email', sendEmail);
router.post('/paid-mail', paidMail);

module.exports = router;
