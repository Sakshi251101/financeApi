const express = require('express');
const router = express.Router();
const progressController = require('../controller/progressController');

router.post('/save', progressController.saveProgress);
router.get('/:userId', progressController.getProgress);

module.exports = router;
