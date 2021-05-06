var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
var app = express();
var jwt = require('jsonwebtoken');
//const sendJobApplicationEmail = require('../emails/emailaccount');
const nodemailer = require("nodemailer");


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for   parsing application/x-www-form-urlencoded
app.use(express.static('public'));

// SET STORAGE for  uploading jobapplications(pdfs)
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/resumes'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage });
//app.use(cors());


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

router.get('/test', function (req, res, next) {
  try {
    //const data = jwt.verify(session.token, 'thisiserpadmintoken')
    //console.log('reached get of dashboard');
    //console.log(req.body.data);
    //res.sendFile(path.join(__dirname, '../public/CustomerSupportSpecialist.html'));
    res.json({ success: 'success' });
    //console.log(path.join(__dirname, '../public/admin.html'));
    //res.sendFile(path.join(__dirname, '../public/admin.html'));

  } catch (e) {
    res.send(400).send(e);
  }

});

/* POST Resumes to Server. */
router.post('/uploadresumes', upload.array('files', 6), (req, res, next) => {
  if (req.files) {
    const files = req.files;
    res.json({ 'FileName': '/nodejs/resumes/' + files[0].originalname });
  }
  else
    return next(error);
});


router.post('/jobapplicationdata', /*upload.array('myfiles', 1),*/function (req, res, next) {
  try {
    var sql = `INSERT INTO jobapplication (JobID,JobTitle,JobCandidateName,JobGender,JobTotalExperience,
      JobCurrentEmployer,JobCurrentPosition,JobCurrentSalary,JobSummariseYourSkills,JobExpectedSalary,
      JobCurrentLocation,
      JobEmail,
      JobPhone,
      JobBestTimeToCall,
      JobDescription,
      JobFileAttachmentURL) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    con.query(sql, [
      req.body.JobID,
      req.body.JobTitle,
      req.body.JobCandidateName,
      req.body.JobGender,
      req.body.JobTotalExperience,
      req.body.JobCurrentEmployer,
      req.body.JobCurrentPosition,
      req.body.JobCurrentSalary,
      req.body.JobSummariseYourSkills,
      req.body.JobExpectedSalary,
      req.body.JobCurrentLocation,
      req.body.JobEmail,
      req.body.JobPhone,
      req.body.JobBestTimeToCall,
      req.body.JobDescription,
      req.body.JobFileAttachmentURL
    ], (err, result) => {
      if (err) return next(err);
      var jobID = req.body.JobID;
      con.query(`SELECT JobPositionMailTo FROM careers WHERE JobID = '${jobID}'`, (err, email) => {
        if (err) return next(err);
        if (email /*&& req.files */) {
          //  const files = req.files;
          // sendJobApplicationEmail(email,req.body);

          let transporter = nodemailer.createTransport({
            host: "mail.inteleants.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'mikepowell@inteleants.com',
              pass: '{}pnF})LIfxz',
            },
          });

          // send mail with defined transport object
          let info = transporter.sendMail({
            from: '"INTELEANTS" <info@inteleants.com>', // sender address
            to: email[0].JobPositionMailTo, // list of receivers
            subject: `Job application for ${req.body.JobTitle}`, // Subject line
            //text: `Welcome to DEEmporium,.`,
            //html: "<b>Order Placed successfully</b>", // html body
            //<p>Hey ${name},</p>
            html: `
            <p>JobTitle :${req.body.JobTitle}</p>
            <p>JobCandidateName:${req.body.JobCandidateName}</p>
            <p>JobGender:${req.body.JobGender}</p>
            <p>JobTotalExperience:${req.body.JobTotalExperience}</p>
            <p>JobCurrentEmployer:${req.body.JobCurrentEmployer}</p>
            <p>JobCurrentPosition:${req.body.JobCurrentPosition}</p>
            <p>JobCurrentSalary:${req.body.JobCurrentSalary}</p>
            <p>JobSummariseYourSkills:${req.body.JobSummariseYourSkills}</p>
            <p>JobExpectedSalary:${req.body.JobExpectedSalary}</p>
            <p>JobCurrentLocation:${req.body.JobCurrentLocation}</p>
            <p>JobEmail:${req.body.JobEmail}</p>
            <p>JobPhone:${req.body.JobPhone}</p>
            <p>JobBestTimeToCall:${req.body.JobBestTimeToCall}</p>
            <p>JobDescription:${req.body.JobDescription}</p>
            <p> Please find the attachment <p>
            <a href='${req.body.JobFileAttachmentURL}'>link</a>`
          });
        }

        res.json([{
          'err': err,
          'status': `${req.body.JobCandidateName}  application submitted successfully`
        }]);
      });
    });


  } catch (e) {
    res.send(400).send(e);
  }

});

module.exports = router;