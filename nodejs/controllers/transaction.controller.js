const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oTransactionRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../Transaction/add_Transaction
oTransactionRouter.post("/add_Transaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newTransaction = new oTransactionModel(oReq.body);
  try{
    // Save Transaction Info
    await newTransaction.save();
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newTransaction.nLoanId,sIsApproved : 'Approved'}).sort({_id:-1}).limit(1);
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
    oTransaction.sAccountNo = newTransaction.sAccountNo;
    oTransaction.nLoanId = newTransaction.nLoanId;
    oTransaction.nCreditAmount = 0;
    oTransaction.nTransactionAmount = newTransaction.nAmount;
    oTransaction.nBalanceAmount = oBalanceAmount - newTransaction.nAmount;
    oTransaction.sDate = newTransaction.sDate;
    oTransaction.sNarration = "By Cash";  
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));



// url: ..../Transaction/Transaction_list
oTransactionRouter.get("/Transaction_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllTransactions = await oTransactionModel.find({nLoanId: newTransaction.nLoanId});

      if(!oAllTransactions){
        return oRes.status(400).send();
      }

      oRes.json(oAllTransactions);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));



// url: ..../Transaction/Need_to_approve_Transaction_list
oTransactionRouter.get("/Need_to_approve_Transaction_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oAllTransactions = await oTransactionModel.find({sIsApproved : 'Pending'});
    //console.log("transactions",oAllTransactions)
 
    if(!oAllTransactions){
      return oRes.status(400).send();
    }

    oRes.json(oAllTransactions);
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../Transaction/approved_Transaction_list
oTransactionRouter.get("/approved_Transaction_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oAllTransactions = await oTransactionModel.find({nLoanId: newTransaction.nLoanId, sIsApproved : 'Approved'});

    if(!oAllTransactions){
      return oRes.status(400).send();
    }

    oRes.json(oAllTransactions);
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));








// url: ..../transaction/gettransactionsbetweendates
oTransactionRouter.post("/gettransactionsbetweendates", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oAllTransactions = await oTransactionModel.find({ sDate:{ $gte: oReq.body.from_date,
    $lte: oReq.body.to_date} , sIsApproved : 'Approved' });

    if(!oAllTransactions){
      return oRes.status(400).send();
    }

    oRes.json(oAllTransactions);
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));


// url: ..../transaction/settransactionapprovalstatus
oTransactionRouter.post("/settransactionapprovalstatus", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    
    let oTransaction = await oTransactionModel.findOne({nTransactionId: oReq.body.nTransactionId});
    // console.log("transaction",oTransaction)
    if(!oTransaction){
      return oRes.status(400).send();
    }
    await oTransactionModel.findByIdAndUpdate(oTransaction._id,{sIsApproved: oReq.body.sIsApproved},{ new: true, runValidators : true});
    let oUpdatedTransaction = await oTransactionModel.findOne({nTransactionId: oReq.body.nTransactionId});
    
    if (oUpdatedTransaction.nBalanceAmount >= 0 && oUpdatedTransaction.nCreditAmount === 0 && oUpdatedTransaction.nDebitAmount !== 0 && oUpdatedTransaction.sIsApproved === "Approved") {
      /* SmS code Start */
      if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
        //get mobile number from account number 
        const oAccount = await obankaccountModel.findOne({ sAccountNo: oUpdatedTransaction.sAccountNo });
        if (oAccount.sSMSAlert === "Yes") {
          const options = {
            "method": "POST",
            "hostname": "api.msg91.com",
            "port": null,
            "path": "/api/v5/flow/",
            "headers": {
              "authkey": "371253At5xrfgrK62b82597P1",
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

          //credit message for customers
          req.write(`{\n  \"flow_id\": \"6205fa53b73c4376f32e3344\",\n  
      \"sender\": \"ADPNXT\",\n  
      \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
      \"acno\": \"${oUpdatedTransaction.sAccountNo}\",\n  
      \"amount\": \"${oUpdatedTransaction.nDebitAmount}\",\n  
      \"date\":\"${oUpdatedTransaction.sDate}\",\n  
      \"tid\":\"${oUpdatedTransaction.nTransactionId}\",\n  
      \"bal\":\"${oUpdatedTransaction.nBalanceAmount}\"\n}`);
     
          req.end();
        }
      }
      /* SmS code End */  
    }

    // Credit transactions   && oTransaction.sIsApproved === 'Approved'
    else if(oUpdatedTransaction.nBalanceAmount >= 0 && oUpdatedTransaction.nCreditAmount !== 0 && oUpdatedTransaction.nDebitAmount === 0 && oUpdatedTransaction.sIsApproved === "Approved"){
       /* SmS code Start */
       if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
        //get mobile number from account number 
        const oAccount = await obankaccountModel.findOne({ sAccountNo: oUpdatedTransaction.sAccountNo });
        if (oAccount.sSMSAlert === "Yes") {
          const options = {
            "method": "POST",
            "hostname": "api.msg91.com",
            "port": null,
            "path": "/api/v5/flow/",
            "headers": {
              "authkey": "371253At5xrfgrK62b82597P1",
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

        //debit message for customers
        req.write(`{\n  \"flow_id\": \"6205fac89240634a2976bac2\",\n  
      \"sender\": \"ADPNXT\",\n  
      \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
      \"acno\": \"${oUpdatedTransaction.sAccountNo}\",\n  
      \"amount\": \"${oUpdatedTransaction.nCreditAmount}\",\n  
      \"date\":\"${oUpdatedTransaction.sDate}\",\n  
      \"tid\":\"${oUpdatedTransaction.nTransactionId}\",\n  
      \"bal\":\"${oUpdatedTransaction.nBalanceAmount}\"\n}`);
          req.end();
        }
      }
      /* SmS code End */  
    }


    oRes.json("Success");  

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

module.exports = oTransactionRouter;