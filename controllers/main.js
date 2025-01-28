const Sequelize = require('sequelize');
const sequelize = require('../util/database');

exports.createTable = async (req, res) => {
    const { tableName, columns } = req.body;

    if(!tableName || !columns || columns.length === 0) {
        return res.status(400).json({ message: "Invalid table"});
    }

    const columnDefine = {};
    columns.forEach((col) => {
        columnDefine[col.name] = { type: Sequelize[col.type.toUpperCase()]};
    });

    try {
        await sequelize.getQueryInterface().createTable(tableName, columnDefine);
        res.status(200).json({ message: "Table created successfully"});
    } catch (error) {
        res.status(500).json({ message: "Error creating table", error: error.message});
    }
};