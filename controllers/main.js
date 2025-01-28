const Sequelize = require('sequelize');
const sequelize = require('../util/database');

exports.getTableData = async (req,res) => {
    const tableName = req.params.tableName;
    try {
        const data = await sequelize.query(`SELECT * FROM ${tableName}`, {type: Sequelize.QueryTypes.SELECT});
        res.status(200).json( {data} );
    } catch(error) {
        res.status(500).json({ message: "Error in getting tableData"})
    }
}

exports.getTables = async (req, res) => {       //will show table names in side menu
    try {
        const tables = await sequelize.query("SHOW TABLES", { type: Sequelize.QueryTypes.SHOWTABLES });
        res.status(200).json({ tables });
    } catch (error) {
        res.status(500).json( { message: "Error fetching tables", error: error.message});
    }
};

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