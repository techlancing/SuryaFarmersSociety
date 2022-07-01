const oExpress = require('express');
const oMongoose = require('mongoose');
//const request = require('request');
const http = require('https');
const oDebitModel = require("../data_base/models/debit.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");
const oAuthentication = require("../middleware/authentication");
const obankaccountModel = require("../data_base/models/bankaccount.model");

const oDebitRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

  

// url: ..../debit/add_debit
oDebitRouter.post("/add_debit", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  const newDebit = new oDebitModel(oReq.body);
  try {
    // Save Debit Info
    await newDebit.save();

    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try {
      const olasttransaction = await oTransactionModel.find({ nLoanId: newDebit.nLoanId, sIsApproved : 'Approved' }).sort({ _id: -1 }).limit(1);
      if (olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
      }

    } catch (e) {
      console.log(e);
      oRes.status(400).send(e);
    }
    if (oReq.body.nAmount > oBalanceAmount) oRes.json("outstanding balance is low");
    else {
      //save transaction model
      let oTransaction = {};
      oTransaction.sAccountNo = newDebit.sAccountNo;
      oTransaction.nLoanId = newDebit.nLoanId;
      oTransaction.nCreditAmount = 0;
      oTransaction.nDebitAmount = newDebit.nAmount;
      oTransaction.nBalanceAmount = (Math.round((oBalanceAmount - newDebit.nAmount) * 100) / 100).toFixed(2);
      oTransaction.sDate = newDebit.sDate;
      oTransaction.sNarration = newDebit.sNarration;
      oTransaction.sAccountType = '';
      oTransaction.sEmployeeName = newDebit.sReceiverName;
      oTransaction.sIsApproved = 'Pending';

      const newTransaction = new oTransactionModel(oTransaction);
      await newTransaction.save();

      const oCreditLoan = await oCreditLoanModel.findOne({ nLoanId: newDebit.nLoanId });

      if (oCreditLoan) {
        newTransaction.sAccountType = oCreditLoan.sTypeofLoan;
        await newTransaction.save();

        if (oTransaction.nBalanceAmount > 0) {
          oCreditLoan.oTransactionInfo.push(newTransaction);
        } else {
          oCreditLoan.oTransactionInfo.push(newTransaction);
          oCreditLoan.sLoanStatus = 'Completed';
        }
        // oCreditLoan.sLoanStatus = 'Completed';
        await oCreditLoan.save();
      }
      if (oTransaction.nBalanceAmount > 0) {
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

        //     //credit message for customers
        //     req.write(`{\n  \"flow_id\": \"6205fa53b73c4376f32e3344\",\n  
        // \"sender\": \"ADPNXT\",\n  
        // \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
        // \"acno\": \"${newTransaction.sAccountNo}\",\n  
        // \"amount\": \"${newTransaction.nDebitAmount}\",\n  
        // \"date\":\"${newTransaction.sDate}\",\n  
        // \"tid\":\"${newTransaction.nTransactionId}\",\n  
        // \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
        //     req.end();
        //   }
        // }
        /* SmS code End */
      }
      oRes.json("Success");
    }
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../debit/edit_debit
oDebitRouter.post("/edit_debit", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oDebit = await oDebitModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oDebit){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../debit/delete_debit
oDebitRouter.post("/delete_debit", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oDebit = await oDebitModel.findByIdAndDelete(oReq.body._id);

    if(!oDebit){
      return oRes.status(400).send();
    }

    oRes.json(oDebit); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../debit/debit_list
oDebitRouter.get("/debit_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllDebits = await oDebitModel.find();

      if(!oAllDebits){
        return oRes.status(400).send();
      }

      oRes.json(oAllDebits);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oDebitRouter;