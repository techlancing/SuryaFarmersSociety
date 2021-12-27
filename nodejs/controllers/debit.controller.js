const oExpress = require('express');
const oMongoose = require('mongoose');
const request = require('request');

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
  try{
    // Save Debit Info
    await newDebit.save();
    
    //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try{
      const olasttransaction = await oTransactionModel.find({nLoanId: newDebit.nLoanId}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
        oBalanceAmount = olasttransaction[0].nBalanceAmount;
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
    oTransaction.nBalanceAmount = (Math.round((oBalanceAmount - newDebit.nAmount) * 100) / 100).toFixed(2);
    oTransaction.sDate = newDebit.sDate;
    oTransaction.sNarration = newDebit.sNarration;
    oTransaction.sAccountType = '';
    oTransaction.sEmployeeName = newDebit.sReceiverName;
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    const oCreditLoan = await oCreditLoanModel.findOne({nLoanId: newDebit.nLoanId});

    if(oCreditLoan){
      newTransaction.sAccountType = oCreditLoan.sTypeofLoan;
      await newTransaction.save();

      if(oTransaction.nBalanceAmount > 0){
        oCreditLoan.oTransactionInfo.push(newTransaction);
        const msg=encodeURIComponent(`Dear customer your acc no: 1234 is Debited with INR 20 on 27-12-2021. 
        txn id: 123. Available balance is INR 50 . 
        Surya cooperative society limited, ADPNXT Technologies.`); 
        const number='919043237478';
        const apikey='NjQ2YTRiMzU0YjYxNzk0MzU5NjMzMzM2NzE0YjZhMzc=';
        
        const sender='TXTLCL';
        let data=`apikey=${apikey}&sender=${sender}&numbers=${number}&message=${msg}`
        // var options = {
        // host: 'api.textlocal.in',
        //   path: '/send?'+data
        // };
        let posturl = 'https://api.textlocal.in/send?'+ data;
        console.log(posturl);
        request({
          method:'POST',
          url: posturl,
          headers:{
            "Content-Type": "application/x-www-form-urlencoded"
          }
          
        },(error, response)=>{
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode);
          oRes.json(response);
        });
      } 
      else
        oCreditLoan.sLoanStatus = 'Completed';
      await oCreditLoan.save();
      oRes.json("Success");
    }

    

  }catch(e){
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