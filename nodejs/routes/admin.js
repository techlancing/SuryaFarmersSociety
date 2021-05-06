var express = require('express');
var router = express.Router();
var path = require('path');
const bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var jwt = require('jsonwebtoken');


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for   parsing application/x-www-form-urlencoded
app.use(express.static('public'));


let mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  database: "intelea_intele",
  user: "intelea_node_admin",
  password: "NodeAdmin@123"

});

con.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to the MySQL server in admin.');
});



/* GET admin screen. */
router.get('/', function (req, res, next) {
  try {
    const data = jwt.verify(session.token, 'thisiserpadmintoken')
    console.log('reached get of dashboard');
    console.log(data);
    console.log(path.join(__dirname, '../public/admin.html'));
    res.sendFile(path.join(__dirname, '../public/admin.html'));

  } catch (e) {
    res.send(400).send(e);
  }

});

app.use((err, req, res, next) => {
  res.json(err);
});


module.exports = router;
