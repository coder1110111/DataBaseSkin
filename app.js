const express= require('express');
const bodyParser= require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const mainRoute = require('./routes/main');
const secondary = require('./routes/secondaryRoute');

const app = express();
 
 app.use(cors());
 app.use(bodyParser.json({extended:false}));
 
 //app.use('/add-to-table',secondary);
 app.use(mainRoute);

 sequelize.sync()
 .then(result => {
    app.listen(3800);
 })
 .catch(err => console.log(err));