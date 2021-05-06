var express = require('express');

var router = express.Router();

var path = require('path');
const bodyParser = require('body-parser');
var app = express();

var session = require('express-session');

var jwt = require('jsonwebtoken');

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
  console.log('Connected to the MySQL server.');
});

app.use(bodyParser.urlencoded({ extended: true }));

/* GET login page. */

router.get('/', function (req, res, next) {

  //res.sendFile(path.join(__dirname, '../public/login.html'));

});



router.post('/', (req, res) => {

  var username = req.body.username;
  var password = req.body.password;
  con.query(`SELECT * FROM admin WHERE username='${username}' AND password='${password}'`, (err, user) => {
    if (err) return next(err);
    if (user[0]) {
      const token = jwt.sign({ username: user[0].username }, 'thisiserpadmintoken');
      session.username = user[0].username;
      session.token = token;

      con.query(`UPDATE admin SET token = '${token}' WHERE username='${username}' AND password='${password}'`, (err, updateadmin) => {
        if (err) return next(err);
        if (updateadmin) {
          console.log(updateadmin);
          res.json([{
            "url": "/createJob.html",
            "token": token
          }]);
        }
      });
    } else {
      res.json([{
        "error": "Invalid username or password"
      }]);
    }
  });
});

app.use((err, req, res, next) => {
  res.json(err);
});

module.exports = router;

