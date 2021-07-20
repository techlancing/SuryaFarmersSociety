const oExpress = require('express');
const oMongoose = require('mongoose');

const oCreditModel = require("../data_base/models/credit.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");


const oCreditRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../credit/add_credit
oCreditRouter.post("/add_credit", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newCredit = new oCreditModel(oReq.body);
  try{
    // Save credit Info
    await newCredit.save(); 
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newCredit.nLoanId}).sort({_id:-1}).limit(1);
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
    oTransaction.sNarration = "Topup Loan";  
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    const oCreditLoan = await oCreditLoanModel.findOne({nLoanId: newCredit.nLoanId});

    if(!oCreditLoan){
      return oRes.status(400).send();
    }
    else{
      oCreditLoan.oTransactionInfo.push(newTransaction);
      await oCreditLoan.save();
    }

    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../credit/edit_credit
oCreditRouter.post("/edit_credit", asyncMiddleware(async(oReq, oRes, oNext) => {
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
oCreditRouter.post("/delete_credit", asyncMiddleware(async (oReq, oRes, oNext) => { 
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
oCreditRouter.get("/credit_list", asyncMiddleware(async(oReq, oRes, oNext) => {
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