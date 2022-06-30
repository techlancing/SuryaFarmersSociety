const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const oDailyDepositModel = require("../data_base/models/dailysavingdeposit.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oAuthentication = require("../middleware/authentication");
const oSavingsTypeModel = require("../data_base/models/savingstype.model");
const oDailyDepositRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

// url: ..../dailysavingdeposit/add_dailydeposittransaction
oDailyDepositRouter.post("/add_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  console.log(oReq.body);
  try {
    // Save Daily deposit Info
    //await newDeposit.save();

    const oSavings = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, nSavingsId: oReq.body.nAccountId });
    if (!oSavings) {
      return oRes.status(400).send();
    }

    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try {
      const olasttransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId }).sort({ _id: -1 }).limit(1);
      if (olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
      }
    } catch (e) {
      console.log(e);
      oRes.status(400).send(e);
    }
    sdate = new Date(oReq.body.sStartDate.split("-").reverse().join("-"));
    let today = new Date(sdate);
    let tomorrow = new Date(today);
    for (let i = 0; i < oReq.body.nTotaldays; i++) {
      //save transaction model

      let oTransaction = {};
      oTransaction.sAccountNo = oReq.body.sAccountNo;
      oTransaction.nLoanId = oReq.body.nAccountId;
      oTransaction.nCreditAmount = 0;
      oTransaction.nDebitAmount = oReq.body.nDayAmount;
      oTransaction.nBalanceAmount = (Math.round((oBalanceAmount + Number(oReq.body.nDayAmount)) * 100) / 100).toFixed(2);
      oBalanceAmount = Number(oTransaction.nBalanceAmount);
      oTransaction.sDate = tomorrow.getFullYear().toString() + "-" + ('0' + (tomorrow.getMonth() + 1)).slice(-2).toString() + "-" + ('0' + tomorrow.getDate()).slice(-2).toString();
      oTransaction.sDate = oTransaction.sDate.split("-").reverse().join("-");
      tomorrow.setDate(tomorrow.getDate() + 1);
      sdate = oTransaction.sDate;
      oTransaction.sNarration = oReq.body.sNarration;
      oTransaction.sAccountType = oSavings.sTypeofSavings;//'Savings Account';
      oTransaction.sEmployeeName = oReq.body.sReceiverName;
      oTransaction.sIsApproved = 'Pending';
      
      const newTransaction = new oTransactionModel(oTransaction);
      await newTransaction.save();

      if (oTransaction.nBalanceAmount > 0) {
        oSavings.oTransactionInfo.push(newTransaction);
        oSavings.nDepositAmount = oTransaction.nBalanceAmount;
        await oSavings.save();
      }
    }

    //update bank account 
    /* let oAccount = await obankaccountModel.findOne({sAccountNo: newDeposit.sAccountNo });
     if(oAccount){
       oAccount.nAmount = oBalanceAmount;
       await oAccount.save();
     }*/
    oRes.json("Success");

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../dailysavingdeposit/edit_dailydeposittransaction
oDailyDepositRouter.post("/edit_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oDeposit = await oDailyDepositModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators: true });

    if (!oDeposit) {
      return oRes.status(400).send();
    }

    oRes.json("Success");
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../dailysavingdeposit/delete_dailydeposittransaction
oDailyDepositRouter.post("/delete_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    console.log(oReq.body._id);
    const oDeposit = await oDailyDepositModel.findByIdAndDelete(oReq.body._id);

    if (!oDeposit) {
      return oRes.status(400).send();
    }

    oRes.json(oDeposit);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../dailysavingdeposit/dailydeposittransaction_list
oDailyDepositRouter.post("/dailydeposittransaction_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    await oDailyDepositModel.find({ sAccountNo: oReq.body.sAccountNo })
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllDeposits) => {
        if (!oError) {
          oRes.json(oAllDeposits);
        }
        else {
          console.log(oError);
          return oRes.status(400).send();
        }
      });
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../dailysavingdeposit/withdraw_dailydeposittransaction
oDailyDepositRouter.post("/withdraw_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  //To get last transaction data to get the balance amount
  const oSavings = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, nSavingsId: oReq.body.nAccountId });
  if (!oSavings) {
    return oRes.status(400).send();
  }
  let oBalanceAmount = 0;
  try {
    const olasttransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId }).sort({ _id: -1 }).limit(1);

    if (olasttransaction.length > 0) {
      oBalanceAmount = olasttransaction[0].nBalanceAmount;
      console.log("last trans");
      if (olasttransaction[0].nBalanceAmount < oReq.body.nAmount) oRes.json("Low Balance");
    }
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
  try {
    if (oBalanceAmount < oReq.body.nAmount) oRes.json("Low Balance");
    else {
      //save transaction model
      let oTransaction = {};
      oTransaction.sAccountNo = oReq.body.sAccountNo;
      oTransaction.nLoanId = oReq.body.nAccountId;
      oTransaction.nCreditAmount = oReq.body.nAmount;
      oTransaction.nDebitAmount = 0;
      console.log(oBalanceAmount);
      oTransaction.nBalanceAmount = (Math.round((oBalanceAmount - Number(oReq.body.nAmount)) * 100) / 100).toFixed(2);
      oBalanceAmount = Number(oTransaction.nBalanceAmount);
      oTransaction.sDate = oReq.body.sEndDate;
      oTransaction.sNarration = oReq.body.sNarration;
      oTransaction.sAccountType = oSavings.sTypeofSavings;
      oTransaction.sEmployeeName = oReq.body.sReceiverName;
      oTransaction.sIsApproved = 'Pending';
      const newTransaction = new oTransactionModel(oTransaction);
      await newTransaction.save();

      if (oTransaction.nBalanceAmount >= 0) {
        oSavings.oTransactionInfo.push(newTransaction);
        oSavings.nDepositAmount = oTransaction.nBalanceAmount;
        await oSavings.save();
      }

      //update bank account 
      let oAccount = await obankaccountModel.findOne({ sAccountNo: oReq.body.sAccountNo });
      if (oAccount) {
        oAccount.nAmount = newTransaction.nBalanceAmount;
        await oAccount.save();
      }
      /* SmS code Start */
  //     if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
  //       //get mobile number from account number 
  //       const oAccount = await obankaccountModel.findOne({ sAccountNo: newTransaction.sAccountNo });
  //       if (oAccount.sSMSAlert === "Yes") {
  //         const options = {
  //           "method": "POST",
  //           "hostname": "api.msg91.com",
  //           "port": null,
  //           "path": "/api/v5/flow/",
  //           "headers": {
  //             "authkey": "371253At5xrfgrK62b82597P1",
  //             "content-type": "application/JSON"
  //           }
  //         };

  //         const req = http.request(options, function (res) {
  //           const chunks = [];

  //           res.on("data", function (chunk) {
  //             chunks.push(chunk);
  //           });

  //           res.on("end", function () {
  //             const body = Buffer.concat(chunks);
  //             console.log(body.toString());
  //           });
  //         });

  //         //credit message for customers
  //         req.write(`{\n  \"flow_id\": \"6205fa53b73c4376f32e3344\",\n  
  // \"sender\": \"ADPNXT\",\n  
  // \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
  // \"acno\": \"${newTransaction.sAccountNo}\",\n  
  // \"amount\": \"${newTransaction.nCreditAmount}\",\n  
  // \"date\":\"${newTransaction.sDate}\",\n  
  // \"tid\":\"${newTransaction.nTransactionId}\",\n  
  // \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
  //         req.end();
  //       }
  //     }
      /* SmS code End */
      oRes.json("Success");
    }

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));


// this api for savings account
// url: ..../dailysavingdeposit/add_savingstransaction
oDailyDepositRouter.post("/add_savingstransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  console.log(oReq.body);
  try {
    // Save Daily deposit Info
    //await newDeposit.save();

    const oBankAccount = await obankaccountModel.findOne({ sAccountNo: oReq.body.sAccountNo });
    if (!oBankAccount) {
      return oRes.status(400).send();
    }

    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try {
      const olasttransaction = await oTransactionModel.find({ nLoanId: oBankAccount.nAccountId }).sort({ _id: -1 }).limit(1);
      if (olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
      }
    } catch (e) {
      console.log(e);
      oRes.status(400).send(e);
    }

    //save transaction model 
    let oTransaction = {};
    oTransaction.sAccountNo = oReq.body.sAccountNo;
    oTransaction.nLoanId = oReq.body.nAccountId;
    oTransaction.nCreditAmount = 0;
    oTransaction.nDebitAmount = oReq.body.nAmount;
    oTransaction.nBalanceAmount = (Math.round((oBalanceAmount + Number(oReq.body.nAmount)) * 100) / 100).toFixed(2);
    oBalanceAmount = Number(oTransaction.nBalanceAmount);
    oTransaction.sDate = oReq.body.sStartDate;
    oTransaction.sNarration = oReq.body.sNarration;
    oTransaction.sAccountType = 'Savings Account';
    oTransaction.sEmployeeName = oReq.body.sReceiverName;
    oTransaction.sIsApproved = 'Pending';
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    if (oTransaction.nBalanceAmount > 0) {
      oBankAccount.nAmount = oTransaction.nBalanceAmount;
      await oBankAccount.save();
    }
    oRes.json("Success");

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// this api for savings account
// url: ..../dailysavingdeposit/withdrawl_savingstransaction
oDailyDepositRouter.post("/withdrawl_savingstransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  console.log(oReq.body);
  try {
    // Save Daily deposit Info
    //await newDeposit.save();

    const oBankAccount = await obankaccountModel.findOne({ sAccountNo: oReq.body.sAccountNo });
    if (!oBankAccount) {
      return oRes.status(400).send();
    }

    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try {
      const olasttransaction = await oTransactionModel.find({ nLoanId: oBankAccount.nAccountId }).sort({ _id: -1 }).limit(1);
      if (olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
      }
    } catch (e) {
      console.log(e);
      oRes.status(400).send(e);
    }
    if (oBalanceAmount < oReq.body.nAmount) oRes.json("Low Balance");
    else {
      //save transaction model   
      let oTransaction = {};
      oTransaction.sAccountNo = oReq.body.sAccountNo;
      oTransaction.nLoanId = oReq.body.nAccountId;
      oTransaction.nCreditAmount = oReq.body.nAmount;
      oTransaction.nDebitAmount = 0;
      oTransaction.nBalanceAmount = (Math.round((oBalanceAmount - Number(oReq.body.nAmount)) * 100) / 100).toFixed(2);
      oBalanceAmount = Number(oTransaction.nBalanceAmount);
      oTransaction.sDate = oReq.body.sStartDate;
      oTransaction.sNarration = oReq.body.sNarration;
      oTransaction.sAccountType = 'Savings Account';
      oTransaction.sEmployeeName = oReq.body.sReceiverName;
      oTransaction.sIsApproved = 'Pending';

      const newTransaction = new oTransactionModel(oTransaction);
      await newTransaction.save();

      if (oTransaction.nBalanceAmount > 0) {
        oBankAccount.nAmount = oTransaction.nBalanceAmount;
        await oBankAccount.save();
      }
      oRes.json("Success");
    }

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

module.exports = oDailyDepositRouter;