const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');

const oSavingsTypeModel = require("../data_base/models/savingstype.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oSavingsTypeRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../savingstype/add_savingstype
oSavingsTypeRouter.post("/add_savingstype", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newSavings = new oSavingsTypeModel(oReq.body);
  try{
    // Save savingstype Info
    await newSavings.save();
    
    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newSavings.sAccountNo;
    oTransaction.nLoanId = newSavings.nSavingsId;
    oTransaction.nCreditAmount = newSavings.nDepositAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = newSavings.nDepositAmount;
    oTransaction.sDate = newSavings.sStartDate;
    oTransaction.sNarration = newSavings.sTypeofSavings;
    oTransaction.sAccountType = newSavings.sTypeofSavings;
    oTransaction.sEmployeeName = newSavings.sEmployeeName;
    
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    //push transaction info and again save savings type
    newSavings.oTransactionInfo = newTransaction._id;
    //newSavings.sLoanStatus = "Active";
    await newSavings.save();

    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../savingstype/addsavingsdeposit_transaction
oSavingsTypeRouter.post("/addsavingsdeposit_transaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    const oSavings = await oSavingsTypeModel.findOne({sAccountNo : oReq.body.sAccountNo});
    if(!oSavings){
      return oRes.status(400).send();  
    }
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: oSavings.nSavingsId}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
       // oRes.send("Success");
      }
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }

    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = oSavings.sAccountNo;
    oTransaction.nLoanId = oSavings.nSavingsId;
    oTransaction.nCreditAmount = oReq.body.nAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = oBalanceAmount + oReq.body.nAmount;
    oTransaction.sDate = oReq.body.sDate;
    oTransaction.sNarration = oReq.body.sNarration;
    oTransaction.sEmployeeName = oReq.body.sReceiverName;  
    oTransaction.sAccountType = oSavings.sTypeofSavings;
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();
   
    oSavings.oTransactionInfo.push(newTransaction);
    oSavings.nDepositAmount = oTransaction.nBalanceAmount;
    await oSavings.save();

      /* SmS code Start */
    if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES"){
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

// url: ..../savingstype/withdrawsavingsdeposit_transaction
oSavingsTypeRouter.post("/withdrawsavingsdeposit_transaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    const oSavings = await oSavingsTypeModel.findOne({sAccountNo : oReq.body.sAccountNo});
    if(!oSavings){
      return oRes.status(400).send();  
    }
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: oSavings.nSavingsId}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
       // oRes.send("Success");
      }
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }

    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = oSavings.sAccountNo;
    oTransaction.nLoanId = oSavings.nSavingsId;
    oTransaction.nCreditAmount = oReq.body.nAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = oBalanceAmount - oReq.body.nAmount;
    oTransaction.sDate = oReq.body.sDate;
    oTransaction.sNarration = oReq.body.sNarration;
    oTransaction.sEmployeeName = oReq.body.sReceiverName;  
    oTransaction.sAccountType = oSavings.sTypeofSavings;
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();
   
    oSavings.oTransactionInfo.push(newTransaction);
    oSavings.nDepositAmount = oTransaction.nBalanceAmount;
    await oSavings.save();

      /* SmS code Start */
    if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES"){
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

// url: ..../savingstype/edit_savingstype
oSavingsTypeRouter.post("/edit_savingstype", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oSavingsType = await oSavingsTypeModel.AndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oSavingsType){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../savingstype/getallsavingstypecount
oSavingsTypeRouter.get("/getallsavingstypecount", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oSavingsType = await oSavingsTypeModel.find();

    if(oSavingsType.length >= 0){
      oRes.json(oSavingsType.length);
    } 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../savingstype/getallsavingstypebalance
oSavingsTypeRouter.get("/getallsavingstypebalance", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oBalance = 0;
    let oSavingsType = await oSavingsTypeModel.find();
    if(oSavingsType.length > 0){
      await Promise.all(oSavingsType.map(async (oSavings) => {
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oSavings.nSavingsId}).sort({_id:-1}).limit(1);
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

// url: ..../savingstype/getaccountsavingstypes
oSavingsTypeRouter.post("/getaccountsavingstypes", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oSavingsType = await oSavingsTypeModel.find( {sAccountNo : oReq.body.sAccountNo});
    let aSavings = [];
    
    if(oSavingsType.length > 0){
      await Promise.all(oSavingsType.map(async (oSavings) => {
        let accountBalance = 0;
        let savings = {
          sSavingsName :'',
          nSavingsBalance : 0
        };
        savings.sSavingsName = oSavings.sTypeofSavings;
        //Get savingstype  last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oSavings.nSavingsId}).sort({_id:-1}).limit(1);
      
        if(olasttransaction.length > 0) {
            accountBalance = accountBalance + olasttransaction[0].nBalanceAmount;
            savings.nSavingsBalance = accountBalance;
          }
          aSavings.push(savings);

      }));

     }
    oRes.json(aSavings);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

// url: ..../savingstype/setsavingstypeapprovalstatus
oSavingsTypeRouter.post("/setsavingstypeapprovalstatus", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oSavingsType = await oSavingsTypeModel.findOne({nSavingsId: oReq.body.nSavingsId});
    if(!oSavingsType){
      return oRes.status(400).send();
    }
    oSavingsType.findByIdAndUpdate(oSavingsType._id,{sIsApproved: oReq.body.sIsApproved},{ new: true, runValidators : true});
    oRes.json("Success");  

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

// url: ..../savingstype/delete_savingstype
oSavingsTypeRouter.post("/delete_savingstype", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oSavingsType = await oSavingsTypeModel.findByIdAndDelete(oReq.body._id);

    if(!oSavingsType){
      return oRes.status(400).send();
    }

    oRes.json(oSavingsType); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../savingstype/savingstype_list
oSavingsTypeRouter.post("/savingstype_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      await oSavingsTypeModel.find({sAccountNo : oReq.body.sAccountNo})
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllSavingsTypes) => {
        if(!oError) {
            oRes.json(oAllSavingsTypes);
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

// url: ..../savingstype/getallsavingtypes
oSavingsTypeRouter.post("/getallsavingtypes", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await oSavingsTypeModel.find()
    .populate({
      path: 'oTransactionInfo'
    }).exec((oError, oAllSavingTypes) => {
      if(!oError) {
          oRes.json(oAllSavingTypes);
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


// url: ..../savingstype/getallsavingstypeByApproval
oSavingsTypeRouter.post("/getallsavingstypeByApproval", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await oSavingsTypeModel.find({sAccountNo : oReq.body.sAccountNo,sIsApproved: "Approved"})
    .populate({
      path: 'oTransactionInfo'
    }).exec((oError, oAllSavingsType) => {
      if(!oError) {
          oRes.json(oAllSavingsType);
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


module.exports = oSavingsTypeRouter;