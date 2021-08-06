const oExpress = require('express');
const oMongoose = require('mongoose');

const oDailyDepositModel = require("../data_base/models/dailysavingdeposit.model");
const oTransactionModel = require("../data_base/models/transaction.model");

const oDailyDepositRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../dailysavingdeposit/add_dailydeposittransaction
oDailyDepositRouter.post("/add_dailydeposittransaction", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newDeposit = new oDailyDepositModel(oReq.body);
  try{
    // Save Daily deposit Info
    await newDeposit.save();
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({sAccountNo: newDeposit.sAccountNo}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
      }
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }

    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newDeposit.sAccountNo;
    oTransaction.nLoanId = newDeposit.nDailyDepositId;
    oTransaction.nCreditAmount = newDeposit.nAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = (Math.round((oBalanceAmount + newDeposit.nAmount) * 100) / 100).toFixed(2);
    oTransaction.sDate = newDeposit.sEndDate;
    oTransaction.sNarration = newDeposit.sNarration;  
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    if(oTransaction.nBalanceAmount > 0)
    {
      newDeposit.oTransactionInfo = newTransaction._id;
      await newDeposit.save();
    }
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../dailysavingdeposit/edit_dailydeposittransaction
oDailyDepositRouter.post("/edit_dailydeposittransaction", asyncMiddleware(async(oReq, oRes, oNext) => {
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
oDailyDepositRouter.post("/delete_dailydeposittransaction", asyncMiddleware(async (oReq, oRes, oNext) => { 
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
oDailyDepositRouter.post("/dailydeposittransaction_list", asyncMiddleware(async(oReq, oRes, oNext) => {
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

module.exports = oDailyDepositRouter;