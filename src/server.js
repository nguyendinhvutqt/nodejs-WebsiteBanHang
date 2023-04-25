const express = require('express');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');

require('dotenv').config();

const ConnectDB = require('./configs/db/ConnectDB');
const routes = require('./routes/index')

const port = process.env.PORT || 3000;

app.use(express.static('public'));

// cấu hình ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
 
// kết nối đến mongodb
ConnectDB(process.env.CONNECTION_STRING);  

// tạo routes
routes(app);

app.get('/', (req, res) => {
    res.render('user/home.ejs');
})

app.listen(port, () => {
    console.log('listening on port ' + port);
});