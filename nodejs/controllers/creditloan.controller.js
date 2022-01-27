const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");

const oCreditLoanRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../creditloan/add_creditloan
oCreditLoanRouter.post("/add_creditloan", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newCreditLoan = new oCreditLoanModel(oReq.body);
  try{
    // Save creditloan Info
    await newCreditLoan.save();
    
    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newCreditLoan.sAccountNo;
    oTransaction.nLoanId = newCreditLoan.nLoanId;
    oTransaction.nCreditAmount = newCreditLoan.nTotalAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = newCreditLoan.nTotalAmount;
    oTransaction.sDate = newCreditLoan.sDate;
    oTransaction.sNarration = newCreditLoan.sTypeofLoan;
    oTransaction.sAccountType = newCreditLoan.sTypeofLoan;
    oTransaction.sEmployeeName = newCreditLoan.sEmployeeName;
    
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    //push transaction info and again save credit loan
    newCreditLoan.oTransactionInfo = newTransaction._id;
    newCreditLoan.sLoanStatus = "Active";
    await newCreditLoan.save();
/* SmS code Start */
if (process.env.IS_PRODUCTION === "YES"){
  const options = {
    "method": "POST",
    "hostname": "api.msg91.com",
    "port": null,
    "path": "/api/v5/flow/",
    "headers": {
      "authkey": "371253A5XBmjXj61cc5295P1",
      "content-type": "application/JSON"
    }
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  //get mobile number from account number 
  const oAccount = await obankaccountModel.findOne({sAccountNo: newTransaction.sAccountNo});
  //debit message for customers
  req.write(`{\n  \"flow_id\": \"61ceee30f6ce631ad9204917\",\n  
  \"sender\": \"ADPNXT\",\n  
  \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
  \"acno\": \"${newTransaction.sAccountNo}\",\n  
  \"amount\": \"${newTransaction.nCreditAmount}\",\n  
  \"date\":\"${newTransaction.sDate}\",\n  
  \"tid\":\"${newTransaction.nTransactionId}\",\n  
  \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
  req.end();
}
/* SmS code End */
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../creditloan/edit_creditloan
oCreditLoanRouter.post("/edit_creditloan", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oCreditLoan = await oCreditLoanModel.AndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oCreditLoan){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../creditloan/getallcreditloancount
oCreditLoanRouter.get("/getallcreditloancount", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oCreditloan = await oCreditLoanModel.find();

    if(oCreditloan.length >= 0){
      oRes.json(oCreditloan.length);
    } 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../creditloan/getallcreditloanbalance
oCreditLoanRouter.get("/getallcreditloanbalance", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oBalance = 0;
    let oCreditLoan = await oCreditLoanModel.find();
    if(oCreditLoan.length > 0){
      await Promise.all(oCreditLoan.map(async (oLoan) => {
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oLoan.nLoanId}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
          oBalance = oBalance + olasttransaction[0].nBalanceAmount;
        }
      }));
    } 
    oRes.json(oBalance);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

// url: ..../creditloan/getaccountcreditloans
oCreditLoanRouter.post("/getaccountcreditloans", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oCreditLoan = await oCreditLoanModel.find( {sAccountNo : oReq.body.sAccountNo});
    let aLoans = [];
    
    if(oCreditLoan.length > 0){
      await Promise.all(oCreditLoan.map(async (oLoan) => {
        let accountBalance = 0;
        let loans = {
          sLoanName :'',
          nLoanBalance : 0
        };
        loans.sLoanName = oLoan.sTypeofLoan;
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oLoan.nLoanId}).sort({_id:-1}).limit(1);
      
        if(olasttransaction.length > 0) {
            accountBalance = accountBalance + olasttransaction[0].nBalanceAmount;
            loans.nLoanBalance = accountBalance;
          }
        aLoans.push(loans);

      }));

     }
    oRes.json(aLoans);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

// url: ..../creditloan/delete_creditloan
oCreditLoanRouter.post("/delete_creditloan", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oCreditLoan = await oCreditLoanModel.findByIdAndDelete(oReq.body._id);

    if(!oCreditLoan){
      return oRes.status(400).send();
    }

    oRes.json(oCreditLoan); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../creditloan/creditloan_list
oCreditLoanRouter.post("/creditloan_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      await oCreditLoanModel.find({sAccountNo : oReq.body.sAccountNo})
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllCreditLoans) => {
        if(!oError) {
            oRes.json(oAllCreditLoans);
        }
        else{
            console.log(oError);
            return oRes.status(400).send();
        }
      });
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oCreditLoanRouter;