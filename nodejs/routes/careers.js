var express = require('express');
var router = express.Router();
var path = require('path');
const bodyParser = require('body-parser');
var app = express();
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

router.get('/', function (req, res, next) {

});


router.post('/createjobposition', function (req, res, next) {
  try {
    var jobid = req.body.JobID;
    con.query(`SELECT * FROM careers WHERE JobID='${jobid}'`, (err, jobs) => {
      if (err) return next(err);
      if (jobs) {
        con.query(`UPDATE careers SET JobID = '${req.body.JobID}',
                JobTitle = '${req.body.JobTitle}',
                JobEmpType = '${req.body.JobEmpType}',
                JobLocation = '${req.body.JobLocation}',
                JobDescription = '${req.body.JobDescription}',
                JobProfile = '${req.body.JobProfile}',
                JobActive = '${req.body.JobActive}',
                JobPositionMailTo = '${req.body.JobPositionMailTo}' WHERE JobID = '${jobid}'`, (err, updateJob) => {
          if (err) return next(err);
          if (updateJob) {
            res.json([{
              'err': err,
              'status': `${jobid} modified successfully`
            }]);
          }
        });

      }
      else {
        var sql = `INSERT INTO careers (JobID,JobTitle,JobEmpType,JobLocation,
            JobDescription,
            JobProfile,
            JobActive,
            JobPositionMailTo) 
            VALUES (?,?,?,?,?,?,?,?)`;
        con.query(sql, [
          req.body.JobID,
          req.body.JobTitle,
          req.body.JobEmpType,
          req.body.JobLocation,
          req.body.JobDescription,
          req.body.JobProfile,
          req.body.JobActive,
          req.body.JobPositionMailTo], (err, result) => {
            if (err) return next(err);
            res.json([{
              'err': err,
              'status': `${req.body.JobTitle} job position created successfully`
            }]);
          });
      }
    });

  } catch (e) {
    res.send(400).send(e);
  }

});

router.get('/getjobpositions', function (req, res, next) {

  //const data = jwt.verify(session.token,'thisiserpteachertoken');
  var id = 1;
  con.query(`SELECT * FROM careers WHERE JobActive='${id}'`, (err, jobs) => {
    if (err) return next(err);
    if (jobs) {
      res.json(jobs);
    } else {
      res.json([
        { "error": 'Unable to find job position data' }]);
    }
  });

});

router.post('/getjobpositionbyid', function (req, res, next) {

  //const data = jwt.verify(session.token,'thisiserpteachertoken');
  var id = 1;
  var jid = req.body.jdID;
  con.query(`SELECT * FROM careers WHERE JobActive='${id}' AND JobID='${jid}'`, (err, jobs) => {
    if (err) return next(err);
    if (jobs) {
      res.json(jobs);
    } else {
      res.json([
        { "error": 'Unable to find job position data' }]);
    }
  });

});

module.exports = router;