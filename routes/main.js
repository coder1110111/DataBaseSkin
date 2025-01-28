const express = require('express');
const router = express.Router();

const mainController = require('../controllers/main');

router.get('/tables', mainController.getTables);
router.get('/table/:tableName', mainController.getTableData);
router.post('/create-table',mainController.createTable);

module.exports = router;