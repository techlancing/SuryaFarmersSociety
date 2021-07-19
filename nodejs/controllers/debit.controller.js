const oExpress = require('express');
const oMongoose = require('mongoose');

const oDebitModel = require("../data_base/models/debit.model");

const oDebitRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../debit/add_debit
oDebitRouter.post("/add_debit", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newDebit = new oDebitModel(oReq.body);
  try{
    // Save Debit Info
    await newDebit.save();
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newDebit.nLoanId}).sort({_id:-1}).limit(1);
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
    oTransaction.sAccountNo = newDebit.sAccountNo;
    oTransaction.nLoanId = newDebit.nLoanId;
    oTransaction.nCreditAmount = 0;
    oTransaction.nDebitAmount = newDebit.nAmount;
    oTransaction.nBalanceAmount = oBalanceAmount - newDebit.nAmount;
    oTransaction.sDate = newDebit.sDate;
    oTransaction.sNarration = "By Cash";  
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../debit/edit_debit
oDebitRouter.post("/edit_debit", asyncMiddleware(async(oReq, oRes, oNext) => {
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
oDebitRouter.post("/delete_debit", asyncMiddleware(async (oReq, oRes, oNext) => { 
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
oDebitRouter.get("/debit_list", asyncMiddleware(async(oReq, oRes, oNext) => {
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