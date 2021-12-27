const oExpress = require('express');
const oMongoose = require('mongoose');

const oDailyDepositModel = require("../data_base/models/dailysavingdeposit.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oAuthentication = require("../middleware/authentication");

const oDailyDepositRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../dailysavingdeposit/add_dailydeposittransaction
oDailyDepositRouter.post("/add_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newDeposit = new oDailyDepositModel(oReq.body);
  console.log(oReq.body);
  try{
    // Save Daily deposit Info
    await newDeposit.save();
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newDeposit.nAccountId}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
      }
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
    sdate=new Date(newDeposit.sStartDate.split("-").reverse().join("-"));
    let today = new Date(sdate);
    let tomorrow = new Date(today);
    for(let i = 0; i < newDeposit.nTotaldays; i++)
    {
      //save transaction model
      
      let oTransaction = {};
      oTransaction.sAccountNo = newDeposit.sAccountNo;
      oTransaction.nLoanId = newDeposit.nAccountId;
      oTransaction.nCreditAmount = 0;
      oTransaction.nDebitAmount = newDeposit.nDayAmount;
      oTransaction.nBalanceAmount = (Math.round((oBalanceAmount + Number(newDeposit.nDayAmount)) * 100) / 100).toFixed(2);
      oBalanceAmount = Number(oTransaction.nBalanceAmount);
      oTransaction.sDate = tomorrow.getFullYear().toString() + "-" + ('0'+ (tomorrow.getMonth()+1)).slice(-2).toString() + "-" + ('0' +tomorrow.getDate()).slice(-2).toString();
      oTransaction.sDate = oTransaction.sDate.split("-").reverse().join("-");
      tomorrow.setDate(tomorrow.getDate() + 1 );
      sdate = oTransaction.sDate;
      oTransaction.sNarration = newDeposit.sNarration;
      oTransaction.sAccountType = 'Savings Account';
      oTransaction.sEmployeeName = newDeposit.sReceiverName;
      
      const newTransaction = new oTransactionModel(oTransaction);
      await newTransaction.save();

      if(oTransaction.nBalanceAmount > 0)
      {
        newDeposit.oTransactionInfo = newTransaction._id;
        await newDeposit.save();
      }
    }

    //update bank account 
    let oAccount = await obankaccountModel.findOne({sAccountNo: newDeposit.sAccountNo });
    if(oAccount){
      oAccount.nAmount = oBalanceAmount;
      await oAccount.save();
    }
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../dailysavingdeposit/edit_dailydeposittransaction
oDailyDepositRouter.post("/edit_dailydeposittransaction", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oDeposit = await oDailyDepositModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oDeposit){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../dailysavingdeposit/delete_dailydeposittransaction
oDailyDepositRouter.post("/delete_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oDeposit = await oDailyDepositModel.findByIdAndDelete(oReq.body._id);

    if(!oDeposit){
      return oRes.status(400).send();
    }

    oRes.json(oDeposit); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../dailysavingdeposit/dailydeposittransaction_list
oDailyDepositRouter.post("/dailydeposittransaction_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      await oDailyDepositModel.find({sAccountNo : oReq.body.sAccountNo})
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllDeposits) => {
        if(!oError) {
            oRes.json(oAllDeposits);
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

// url: ..../dailysavingdeposit/withdraw_dailydeposittransaction
oDailyDepositRouter.post("/withdraw_dailydeposittransaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  //To get last transaction data to get the balance amount
  let oBalanceAmount = 0;
  try{
    const olasttransaction = await oTransactionModel.find({nLoanId: oReq.body.nAccountId}).sort({_id:-1}).limit(1);
  
    if(olasttransaction.length > 0) {
      oBalanceAmount = olasttransaction[0].nBalanceAmount;
      console.log("last trans");
    }
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
  try{
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
    oTransaction.sAccountType = 'Savings Account'; 
    oTransaction.sEmployeeName = oReq.body.sReceiverName;

    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    //update bank account 
    let oAccount = await obankaccountModel.findOne({sAccountNo: oReq.body.sAccountNo });
    if(oAccount){
      oAccount.nAmount = newTransaction.nBalanceAmount;
      await oAccount.save();
    }

    oRes.json("Success");
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }


}));
module.exports = oDailyDepositRouter;