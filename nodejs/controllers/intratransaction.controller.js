const oExpress = require('express');
const oMongoose = require('mongoose');

const oIntraTransactionModel = require("../data_base/models/intratransaction.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oDailyDepositModel = require("../data_base/models/dailysavingdeposit.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");
const oBankAccountModel = require("../data_base/models/bankaccount.model");
const oAuthentication = require("../middleware/authentication");
const oSavingsTypeModel = require("../data_base/models/savingstype.model");



const oIntraTransactionRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

// url: ..../intratransaction/add_intratransaction
oIntraTransactionRouter.post("/add_intratransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  const newIntraTransaction = new oIntraTransactionModel(oReq.body);
  try {
    // Save Intra Transaction Info
    await newIntraTransaction.save();
    oRes.json("Success");
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../intratransaction/intraaccounttransaction
oIntraTransactionRouter.post("/intraaccounttransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {

    //To Credit amount to reciever account
    let oBalanceAmount = 0;
    const oBankAccount = await oBankAccountModel.findOne({ sAccountNo: oReq.body.sSenderAccountNumber });
    if (!oBankAccount) {
      return oRes.status(400).send();
    }
    const olasttransactionAccount = await oTransactionModel.find({ nLoanId: oBankAccount.nAccountId, sIsApproved : 'Approved' }).sort({ _id: -1 }).limit(1);
    if (olasttransactionAccount.length > 0) {
      let oBalance = olasttransactionAccount[0].nBalanceAmount
      if (oBalance < oReq.body.nAmount) return oRes.json("Low Balance");
      else {
        console.log("transact",olasttransactionAccount,"last",olasttransactionAccount.nBalanceAmount,"req",oReq.body.nAmount);
        //save transaction model
        let oTransaction = {};
        oTransaction.sAccountNo = oReq.body.sRecieverAccountNumber;
        oTransaction.sDate = oReq.body.sDate;
        oTransaction.sNarration = oReq.body.sNarration;
        oTransaction.sEmployeeName = oReq.body.sTransactionEmployee;
        oTransaction.sIsApproved = 'Pending';

        try {
          if (oReq.body.sRecieverAccountType == 'savings')    // savings account
          {
            oTransaction.sAccountType = 'Savings Account';
            oTransaction.nCreditAmount = 0;
            oTransaction.nDebitAmount = oReq.body.nAmount;
            oTransaction.nLoanId = oReq.body.nReceiverAccountId;

            const olasttransaction = await oTransactionModel.find({ nLoanId: oReq.body.nReceiverAccountId, sIsApproved : 'Approved' }).sort({ _id: -1 }).limit(1);
            if (olasttransaction.length > 0)
              oBalanceAmount = olasttransaction[0].nBalanceAmount;

            oTransaction.nBalanceAmount = (Math.round((oBalanceAmount + oReq.body.nAmount) * 100) / 100).toFixed(2);

            // Update total amount in dailysavingdeposit model
            let oSavingsAccount = oDailyDepositModel.findOne({ nAccountId: oReq.body.nReceiverAccountId });
            if (oSavingsAccount)
              oDailyDepositModel.findByIdAndUpdate(oSavingsAccount._id, { nAmount: oTransaction.nBalanceAmount }, { new: true, runValidators: true });

            // Update total amount in bankaccount model
            let oBankAccount = oBankAccountModel.findOne({ nAccountId: oReq.body.nReceiverAccountId });
            if (oBankAccount)
              oBankAccountModel.findByIdAndUpdate(oBankAccount._id, { nAmount: oTransaction.nBalanceAmount }, { new: true, runValidators: true });

            const newTransaction = new oTransactionModel(oTransaction);
            await newTransaction.save();
          }
          else if (oReq.body.sRecieverAccountType == 'loan')  // credit loan
          {
            oTransaction.nCreditAmount = 0;
            oTransaction.nDebitAmount = oReq.body.nAmount;
            oTransaction.nLoanId = oReq.body.nLoanId;
            const olasttransaction = await oTransactionModel.find({ nLoanId: oReq.body.nLoanId ,sIsApproved : 'Approved'}).sort({ _id: -1 }).limit(1);
            if (olasttransaction.length > 0)
              oBalanceAmount = olasttransaction[0].nBalanceAmount;

            console.log('oBalanceAmount creditloan', oBalanceAmount);

            oTransaction.nBalanceAmount = (Math.round((oBalanceAmount - oReq.body.nAmount) * 100) / 100).toFixed(2);

            const newTransaction = new oTransactionModel(oTransaction);
            await newTransaction.save();

            // Update total amount in creditloan model
            let oCreditLoan = await oCreditLoanModel.findOne({ nLoanId: oReq.body.nLoanId });
            if (oCreditLoan) {
              newTransaction.sAccountType = oCreditLoan.sTypeofLoan;
              await newTransaction.save();
              oCreditLoan.oTransactionInfo.push(newTransaction);
              await oCreditLoan.save();
            }

          }


          else if (oReq.body.sRecieverAccountType == 'savingtype')  // saving type
          {
            const oSavingsType = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sRecieverAccountNumber, nSavingsId: oReq.body.nLoanId });
            if (!oSavingsType) {
              return oRes.status(400).send();
            }
            oTransaction.nCreditAmount = 0;
            oTransaction.nDebitAmount = oReq.body.nAmount;
            oTransaction.nLoanId = oReq.body.nLoanId;
            const olasttransaction = await oTransactionModel.find({ nLoanId: oReq.body.nLoanId ,sIsApproved : 'Approved'}).sort({ _id: -1 }).limit(1);
            if (olasttransaction.length > 0)
              oBalanceAmount = olasttransaction[0].nBalanceAmount;

            oTransaction.nBalanceAmount = (Math.round((oBalanceAmount + oReq.body.nAmount) * 100) / 100).toFixed(2);
            oTransaction.sAccountType = oSavingsType.sTypeofSavings;
            const newTransaction = new oTransactionModel(oTransaction);
            await newTransaction.save();

            if (oTransaction.nBalanceAmount > 0) {
              oSavingsType.oTransactionInfo.push(newTransaction);
              oSavingsType.nDepositAmount = oTransaction.nBalanceAmount;
              await oSavingsType.save();
            }
          }
        } catch (e) {
          console.log(e);
          oRes.status(400).send(e);
        }


        //To Debit amount from sender account
        let oBalanceAmt = 0;
        try {
          const olasttransaction = await oTransactionModel.find({ nLoanId: oReq.body.nSenderAccountId,sIsApproved : 'Approved' }).sort({ _id: -1 }).limit(1);
          if (olasttransaction.length > 0) {
            console.log('olasttransaction', olasttransaction[0]);

            oBalanceAmt = olasttransaction[0].nBalanceAmount;
          }
        } catch (e) {
          console.log(e);
          oRes.status(400).send(e);
        }

        //save transaction model
        let oTransactionInfo = {};
        oTransactionInfo.sAccountNo = oReq.body.sSenderAccountNumber;
        oTransactionInfo.nLoanId = oReq.body.nSenderAccountId;
        oTransactionInfo.nCreditAmount = oReq.body.nAmount;
        oTransactionInfo.nDebitAmount = 0;
        console.log(oBalanceAmt);
        oTransactionInfo.nBalanceAmount = (Math.round((oBalanceAmt - oReq.body.nAmount) * 100) / 100).toFixed(2);
        oTransactionInfo.sDate = oReq.body.sDate;
        oTransactionInfo.sNarration = oReq.body.sNarration;
        oTransactionInfo.sEmployeeName = 'Savings Account';
        oTransactionInfo.sEmployeeName = oReq.body.sTransactionEmployee;
        oTransactionInfo.sIsApproved = 'Pending';

        const newTransaction = new oTransactionModel(oTransactionInfo);
        await newTransaction.save();
        console.log('newtransaction', newTransaction);

        // Update total amount in dailysavingdeposit model
        let oSenderAccount = await oDailyDepositModel.findOne({ nAccountId: oReq.body.nSenderAccountId });
        if (oSenderAccount)
          await oDailyDepositModel.findByIdAndUpdate(oSenderAccount._id, { nAmount: oTransactionInfo.nBalanceAmount }, { new: true, runValidators: true });

        // Update total amount in bankaccount model
        let oSenderBankAccount = await oBankAccountModel.findOne({ nAccountId: oReq.body.nSenderAccountId });
        if (oSenderBankAccount)
          await oBankAccountModel.findByIdAndUpdate(oSenderBankAccount._id, { nAmount: oTransactionInfo.nBalanceAmount }, { new: true, runValidators: true });

        oRes.json("Success");

      }
    }

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../intratransaction/edit_intratransaction
oIntraTransactionRouter.post("/edit_intratransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oIntraTransaction = await oIntraTransactionModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators: true });

    if (!oIntraTransaction) {
      return oRes.status(400).send();
    }

    oRes.json("Success");
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../intratransaction/delete_intratransaction
oIntraTransactionRouter.post("/delete_intratransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    console.log(oReq.body._id);
    const oIntraTransaction = await oIntraTransactionModel.findByIdAndDelete(oReq.body._id);

    if (!oIntraTransaction) {
      return oRes.status(400).send();
    }

    oRes.json(oIntraTransaction);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../intratransaction/intratransaction_list
oIntraTransactionRouter.get("/intratransaction_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oAllIntraTransaction = await oIntraTransactionModel.find();

    if (!oAllIntraTransaction) {
      return oRes.status(400).send();
    }

    oRes.json(oAllIntraTansaction);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

module.exports = oIntraTransactionRouter;