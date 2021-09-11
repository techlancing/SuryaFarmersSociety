const oExpress = require('express');
const oMongoose = require('mongoose');

const oCreditLoanModel = require("../data_base/models/creditloan.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");

const oCreditLoanRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };
  
// url: ..../creditloan/add_creditloan
oCreditLoanRouter.post("/add_creditloan", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newCreditLoan = new oCreditLoanModel(oReq.body);
  try{
    // Save creditloan Info
    await newCreditLoan.save();
    
    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newCreditLoan.sAccountNo;
    oTransaction.nLoanId = newCreditLoan.nLoanId;
    oTransaction.nCreditAmount = newCreditLoan.nTotalAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = newCreditLoan.nTotalAmount;
    oTransaction.sDate = newCreditLoan.sDate;
    oTransaction.sNarration = newCreditLoan.sTypeofLoan;  
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    //push transaction info and again save credit loan
    newCreditLoan.oTransactionInfo = newTransaction._id;
    newCreditLoan.sLoanStatus = "Active";
    await newCreditLoan.save();

    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../creditloan/edit_creditloan
oCreditLoanRouter.post("/edit_creditloan", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oCreditLoan = await oCreditLoanModel.AndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oCreditLoan){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));2

// url: ..../creditloan/delete_creditloan
oCreditLoanRouter.post("/delete_creditloan", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oCreditLoan = await oCreditLoanModel.findByIdAndDelete(oReq.body._id);

    if(!oCreditLoan){
      return oRes.status(400).send();
    }

    oRes.json(oCreditLoan); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../creditloan/creditloan_list
oCreditLoanRouter.post("/creditloan_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      await oCreditLoanModel.find({sAccountNo : oReq.body.sAccountNo})
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllCreditLoans) => {
        if(!oError) {
            oRes.json(oAllCreditLoans);
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

module.exports = oCreditLoanRouter;