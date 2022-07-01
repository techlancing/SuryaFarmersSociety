const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oCreditModel = require("../data_base/models/credit.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");
const oAuthentication = require("../middleware/authentication");

const oCreditRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../credit/add_credit
oCreditRouter.post("/add_credit", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newCredit = new oCreditModel(oReq.body);
  try{
    // Save credit Info
    await newCredit.save(); 
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newCredit.nLoanId, sIsApproved : 'Approved'}).sort({_id:-1}).limit(1);
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
    oTransaction.sAccountNo = newCredit.sAccountNo;
    oTransaction.nLoanId = newCredit.nLoanId;
    oTransaction.nCreditAmount = newCredit.nAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = oBalanceAmount + newCredit.nAmount;
    oTransaction.sDate = newCredit.sDate;
    oTransaction.sNarration = newCredit.sNarration;
    oTransaction.sAccountType = '';
    oTransaction.sEmployeeName = newCredit.sReceiverName;
    oTransaction.sIsApproved = 'Pending';
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    const oCreditLoan = await oCreditLoanModel.findOne({nLoanId: newCredit.nLoanId});

    if(oCreditLoan){
      newTransaction.sAccountType = oCreditLoan.sTypeofLoan;
      await newTransaction.save();
      
      oCreditLoan.oTransactionInfo.push(newTransaction);
      await oCreditLoan.save();
    }
    
      /* SmS code Start */
    // if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
    //   //get mobile number from account number 
    //   const oAccount = await obankaccountModel.findOne({ sAccountNo: newTransaction.sAccountNo });
    //   if (oAccount.sSMSAlert === "Yes") {
    //     const options = {
    //       "method": "POST",
    //       "hostname": "api.msg91.com",
    //       "port": null,
    //       "path": "/api/v5/flow/",
    //       "headers": {
    //         "authkey": "371253At5xrfgrK62b82597P1",
    //         "content-type": "application/JSON"
    //       }
    //     };

    //     const req = http.request(options, function (res) {
    //       const chunks = [];

    //       res.on("data", function (chunk) {
    //         chunks.push(chunk);
    //       });

    //       res.on("end", function () {
    //         const body = Buffer.concat(chunks);
    //         console.log(body.toString());
    //       });
    //     });

    //     //debit message for customers
    //     req.write(`{\n  \"flow_id\": \"6205fac89240634a2976bac2\",\n  
    //   \"sender\": \"ADPNXT\",\n  
    //   \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
    //   \"acno\": \"${newTransaction.sAccountNo}\",\n  
    //   \"amount\": \"${newTransaction.nCreditAmount}\",\n  
    //   \"date\":\"${newTransaction.sDate}\",\n  
    //   \"tid\":\"${newTransaction.nTransactionId}\",\n  
    //   \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
    //     req.end();
    //   }
    // }
    /* SmS code End */

    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../credit/edit_credit
oCreditRouter.post("/edit_credit", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oCredit = await oCreditModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oCredit){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../credit/delete_credit
oCreditRouter.post("/delete_credit", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oCredit = await oCreditModel.findByIdAndDelete(oReq.body._id);

    if(!oCredit){
      return oRes.status(400).send();
    }

    oRes.json(oCredit); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../credit/credit_list
oCreditRouter.get("/credit_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllCredits = await oCreditModel.find();

      if(!oAllCredits){
        return oRes.status(400).send();
      }

      oRes.json(oAllCredits);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oCreditRouter;