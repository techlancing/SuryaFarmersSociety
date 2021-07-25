const oExpress = require('express');
const oMongoose = require('mongoose');

const oTransactionModel = require("../data_base/models/transaction.model");
const oTransactionRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../Transaction/add_Transaction
oTransactionRouter.post("/add_Transaction", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newTransaction = new oTransactionModel(oReq.body);
  try{
    // Save Transaction Info
    await newTransaction.save();
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newTransaction.nLoanId}).sort({_id:-1}).limit(1);
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
oTransactionRouter.get("/Transaction_list", asyncMiddleware(async(oReq, oRes, oNext) => {
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

module.exports = oTransactionRouter;