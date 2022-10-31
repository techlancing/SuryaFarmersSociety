const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oSavingsTypeModel = require("../data_base/models/savingstype.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");
const transactionModel = require('../data_base/models/transaction.model');
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
  try {
    // Save Transaction Info
    await newTransaction.save();

    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try {
      const olasttransaction = await oTransactionModel.find({ nLoanId: newTransaction.nLoanId, sIsApproved: 'Approved' }).sort({ _id: -1 }).limit(1);
      if (olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
        // oRes.send("Success");
      }
    } catch (e) {
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

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));



// url: ..../Transaction/Transaction_list
oTransactionRouter.get("/Transaction_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oAllTransactions = await oTransactionModel.find({ nLoanId: newTransaction.nLoanId });

    if (!oAllTransactions) {
      return oRes.status(400).send();
    }

    oRes.json(oAllTransactions);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));



// url: ..../Transaction/Need_to_approve_Transaction_list
oTransactionRouter.get("/Need_to_approve_Transaction_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oAllTransactions = await oTransactionModel.find({ sIsApproved: 'Pending' });
    //console.log("transactions",oAllTransactions)

    if (!oAllTransactions) {
      return oRes.status(400).send({ status: "empty" });
    }

    oRes.json(oAllTransactions);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../Transaction/approved_Transaction_list
oTransactionRouter.get("/approved_Transaction_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oAllTransactions = await oTransactionModel.find({ nLoanId: newTransaction.nLoanId, sIsApproved: 'Approved' });

    if (!oAllTransactions) {
      return oRes.status(400).send();
    }

    oRes.json(oAllTransactions);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));








// url: ..../transaction/gettransactionsbetweendates
oTransactionRouter.post("/gettransactionsbetweendates", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oAllTransactions = await oTransactionModel.find({
      sDate: {
        $gte: oReq.body.from_date,
        $lte: oReq.body.to_date
      }, sIsApproved: 'Approved'
    });

    if (!oAllTransactions) {
      return oRes.status(400).send();
    }

    oRes.json(oAllTransactions);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));


// url: ..../transaction/settransactionapprovalstatus
oTransactionRouter.post("/settransactionapprovalstatus", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oSavingTypeCheck = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, nSavingsId: oReq.body.nLoanId });
    const oCreditLoanCheck = await oCreditLoanModel.findOne({ sAccountNo: oReq.body.sAccountNo, nLoanId: oReq.body.nLoanId });
    const oBankAccountCheck = await obankaccountModel.findOne({ sAccountNo: oReq.body.sAccountNo, nAccountId: oReq.body.nLoanId });
    console.log("accounts are",oReq.body.sAccountNo,oReq.body.nLoanId,oSavingTypeCheck,oCreditLoanCheck,oBankAccountCheck);
    if (oSavingTypeCheck) {

      if (oSavingTypeCheck.sIsApproved !== 'Approved') {
        if(oReq.body.sIsApproved === 'Rejected'){
          return oRes.json({ status: "Success", "message": `${oSavingTypeCheck.sTypeofSavings} (${oSavingTypeCheck.nDepositAmount}) of "${oSavingTypeCheck.sAccountNo} is Rejected Successfully."` });  
        }
        return oRes.json({ status: "error", "message": `You need to "Approve" the ${oSavingTypeCheck.sTypeofSavings} (${oSavingTypeCheck.nDepositAmount}) of "${oSavingTypeCheck.sAccountNo}"` });
      }
      if (oSavingTypeCheck.sStatus !== 'Active') {
        if(oReq.body.sIsApproved === 'Rejected'){
          return oRes.json({ status: "Success", "message": `${oSavingTypeCheck.sTypeofSavings} (${oSavingTypeCheck.nDepositAmount}) of "${oSavingTypeCheck.sAccountNo} is Rejected Successfully."` });  
        }
        return oRes.json({ status: "error", "message": `You need to Activate the Account ${oSavingTypeCheck.sTypeofSavings} (${oSavingTypeCheck.nDepositAmount}) of "${oSavingTypeCheck.sAccountNo}"` });
      }

    } else if (oCreditLoanCheck) {

      if (oCreditLoanCheck.sIsApproved !== 'Approved') {
        if(oReq.body.sIsApproved === 'Rejected'){
          return oRes.json({ status: "Success", "message": `${oCreditLoanCheck.sTypeofLoan} (${oCreditLoanCheck.nSanctionAmount}) of "${oCreditLoanCheck.sAccountNo}" is Rejected Successfully."` });  
        }
        return oRes.json({ status: "error", "message": `You need to "Approve" the ${oCreditLoanCheck.sTypeofLoan} (${oCreditLoanCheck.nSanctionAmount}) of "${oCreditLoanCheck.sAccountNo}"` });
      }
      if (oCreditLoanCheck.sLoanStatus !== 'Active') {
        if(oReq.body.sIsApproved === 'Rejected'){
          return oRes.json({ status: "Success", "message": `${oCreditLoanCheck.sTypeofLoan} (${oCreditLoanCheck.nSanctionAmount}) of "${oCreditLoanCheck.sAccountNo}" is Rejected Successfully."` });  
        }
        return oRes.json({ status: "error", "message": `You need to Activate the Account ${oCreditLoanCheck.sTypeofLoan} (${oCreditLoanCheck.nSanctionAmount}) of "${oCreditLoanCheck.sAccountNo}"` });
      }

    } else if (oBankAccountCheck) {

      if(oReq.body.sIsApproved === 'Rejected'){
        return oRes.json({ status: "Success", "message": `Transaction  of "${oBankAccountCheck.sAccountNo}" is Rejected Successfully."` });  
      }
      if (oBankAccountCheck.bIsDeactivated !== false) return oRes.status(400).send({ status: "error", "message": `Activate the Bank Account ${oBankAccountCheck.sAccountNo}` });

    } else return oRes.json({ status: "error", "message": "Not Belong to Any Account" });


    let oTransaction = await oTransactionModel.findOne({ nTransactionId: oReq.body.nTransactionId });
    // console.log("transaction",oTransaction)
    if (!oTransaction) {
      return oRes.json({ status: "error", "message": "This transaction is not exists" });
    } else {
      //checking dailysaving prevois transaction approved or not. nTransactionId: oTransaction.nTransactionId-1, nLoanId : oTransaction.nLoanId,
      if (oTransaction.sAccountType == 'Daily Deposit') {
        const previoustransaction = await oTransactionModel.findOne({ nTransactionId: oTransaction.nTransactionId - 1, sIsApproved: "Pending" });
        if (previoustransaction) {
          return oRes.json({ status: "A-P-Pending", message: `Transaction ${previoustransaction.nTransactionId} is pending.` });
        }
        //  else {
        //   //handling the rejected transactions in dailysaving deposit
        //   if (oReq.body.sIsApproved == 'Rejected') {  //{ "sIsApproved": "Rejected" }
        //     const rejectedabovetransactions = await oTransactionModel.find({ match: { and: [{ "nTransactionId": { $gt: oTransaction.nTransactionId } }, { "nLoanId": oTransaction.nLoanId }] } }).sort(1);
        //     if (rejectedabovetransactions.length > 0) {
        //       rejectedabovetransactions.forEach((tranaction) => {
        //         tranaction.nBalanceAmount -=  oTransaction.nDebitAmount;
        //         if( tranaction.nBalanceAmount > 0){
        //           tranaction.save();
        //         }
        //       })
        //     }
        //   }

        // }
      }



      await oTransactionModel.findByIdAndUpdate(oTransaction._id, { sIsApproved: oReq.body.sIsApproved }, { new: true, runValidators: true });
      let oUpdatedTransaction = await oTransactionModel.findOne({ nTransactionId: oReq.body.nTransactionId });
      // console.log("updated transaction is",oUpdatedTransaction);

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
      else if (oUpdatedTransaction.nBalanceAmount >= 0 && oUpdatedTransaction.nCreditAmount !== 0 && oUpdatedTransaction.nDebitAmount === 0 && oUpdatedTransaction.sIsApproved === "Approved") {
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


      oRes.json({ status: "Success" });
    }

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

module.exports = oTransactionRouter;