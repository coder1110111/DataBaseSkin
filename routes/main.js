const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');

router.post('/create-table',mainController.createTable);

module.exports = router;