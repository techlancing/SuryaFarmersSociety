const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');

const oSavingsTypeModel = require("../data_base/models/savingstype.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oSavingsTypeRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

// url: ..../savingstype/add_savingstype
oSavingsTypeRouter.post("/add_savingstype", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  const newSavings = new oSavingsTypeModel(oReq.body);
  console.log('newSavings', newSavings)
  try {
    //checking the savingtype already exists or not
    const oSavings = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, sTypeofSavings: oReq.body.sTypeofSavings, sIsApproved : 'Approved', sStatus : 'Active'});
    if (oSavings) {
      return oRes.json("Exists").send();
    }
    // Save savingstype Info
    await newSavings.save();

    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newSavings.sAccountNo;
    oTransaction.nLoanId = newSavings.nSavingsId;
    oTransaction.nCreditAmount = 0;
    oTransaction.nDebitAmount = newSavings.nDepositAmount;
    oTransaction.nBalanceAmount = newSavings.nDepositAmount;
    oTransaction.sDate = newSavings.sStartDate;
    let type = newSavings.sTypeofSavings.split(" ");
    oTransaction.sNarration = type[0]+"_"+type[1];
    oTransaction.sAccountType = newSavings.sTypeofSavings;
    oTransaction.sEmployeeName = newSavings.sEmployeeName;
    oTransaction.sIsApproved = 'Pending';
    
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    //push transaction info and again save savings type
    newSavings.oTransactionInfo = newTransaction._id;
    //newSavings.sLoanStatus = "Active";
    await newSavings.save();

    oRes.json({status : "Success",id : newTransaction.nTransactionId});

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../savingstype/addsavingsdeposit_transaction
oSavingsTypeRouter.post("/addsavingsdeposit_transaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oSavings = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, nSavingsId: oReq.body.nLoanId });
    if (!oSavings) {
      return oRes.status(400).send({status : "Error" , msg : `${oReq.body.sAccountNo}- SavingType is not available`});
    }
    //To find Pending Transaction
    const opendingtransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId, sIsApproved: 'Pending' }).sort({ _id: -1 }).limit(1);
    if (opendingtransaction.length > 0) {
      oRes.json({ status: "A-Pending", id: opendingtransaction[0].nTransactionId });
    }
    else {
      //To get last transaction data to get the balance amount
    let oBalanceAmount = 0;
    try {
      const olasttransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId ,sIsApproved : 'Approved'}).sort({ _id: -1 }).limit(1);
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
    oTransaction.sAccountNo = oSavings.sAccountNo;
    oTransaction.nLoanId = oSavings.nSavingsId;
    oTransaction.nCreditAmount = 0;
    oTransaction.nDebitAmount = oReq.body.nAmount;
    oTransaction.nBalanceAmount = oBalanceAmount + oReq.body.nAmount;
    oTransaction.sDate = oReq.body.sDate;
    oTransaction.sNarration = oReq.body.sNarration;
    oTransaction.sEmployeeName = oReq.body.sReceiverName;
    oTransaction.sAccountType = oSavings.sTypeofSavings;
    oTransaction.sIsApproved = 'Pending';
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    oSavings.oTransactionInfo.push(newTransaction);
    oSavings.nDepositAmount = oTransaction.nBalanceAmount;
    await oSavings.save();

    /* SmS code Start */
    // if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
    //   const options = {
    //     "method": "POST",
    //     "hostname": "api.msg91.com",
    //     "port": null,
    //     "path": "/api/v5/flow/",
    //     "headers": {
    //       "authkey": "371253At5xrfgrK62b82597P1",
    //       "content-type": "application/JSON"
    //     }
    //   };

    //   const req = http.request(options, function (res) {
    //     const chunks = [];

    //     res.on("data", function (chunk) {
    //       chunks.push(chunk);
    //     });

    //     res.on("end", function () {
    //       const body = Buffer.concat(chunks);
    //       console.log(body.toString());
    //     });
    //   });
    //   //get mobile number from account number 
    //   const oAccount = await obankaccountModel.findOne({ sAccountNo: newTransaction.sAccountNo });
    //   //debit message for customers
    //   req.write(`{\n  \"flow_id\": \"6205fac89240634a2976bac2\",\n  
    //   \"sender\": \"ADPNXT\",\n  
    //   \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
    //   \"acno\": \"${newTransaction.sAccountNo}\",\n  
    //   \"amount\": \"${newTransaction.nCreditAmount}\",\n  
    //   \"date\":\"${newTransaction.sDate}\",\n  
    //   \"tid\":\"${newTransaction.nTransactionId}\",\n  
    //   \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
    //   req.end();
    // }
    /* SmS code End */

    oRes.json({status : "Success",id : newTransaction.nTransactionId});

    }
    
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../savingstype/withdrawsavingsdeposit_transaction
oSavingsTypeRouter.post("/withdrawsavingsdeposit_transaction", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oSavings = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, nSavingsId: oReq.body.nLoanId });
    if (!oSavings) {
      return oRes.status(400).send({status : "Error", msg : `${oReq.body.sAccountNo}- SavingType not available`});
    }
    //To find Pending Transaction
    const opendingtransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId, sIsApproved: 'Pending' }).sort({ _id: -1 }).limit(1);
    if (opendingtransaction.length > 0) {
      oRes.json({ status: "A-Pending", id: opendingtransaction[0].nTransactionId });
    }
    else {
      //To get last transaction data to get the balance amount
      let oBalanceAmount = 0;
      try {
        const olasttransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId, sIsApproved: 'Approved' }).sort({ _id: -1 }).limit(1);
        if (olasttransaction.length > 0) {
          oBalanceAmount = olasttransaction[0].nBalanceAmount;
          // send the response if balance is low 

        }
      } catch (e) {
        console.log(e);
        oRes.status(400).send(e);
      }
      if (oBalanceAmount < oReq.body.nAmount) oRes.json({ status: "low", msg: "Outstanding Balance is Low." });
      else {
        //save transaction model
        let oTransaction = {};
        oTransaction.sAccountNo = oSavings.sAccountNo;
        oTransaction.nLoanId = oSavings.nSavingsId;
        oTransaction.nCreditAmount = oReq.body.nAmount;
        oTransaction.nDebitAmount = 0;
        oTransaction.nBalanceAmount = oBalanceAmount - oReq.body.nAmount;
        oTransaction.sDate = oReq.body.sDate;
        oTransaction.sNarration = oReq.body.sNarration;
        oTransaction.sEmployeeName = oReq.body.sReceiverName;
        oTransaction.sAccountType = oSavings.sTypeofSavings;
        oTransaction.sIsApproved = 'Pending';

        const newTransaction = new oTransactionModel(oTransaction);
        await newTransaction.save();

        oSavings.oTransactionInfo.push(newTransaction);
        oSavings.nDepositAmount = oTransaction.nBalanceAmount;
        await oSavings.save();

        /* SmS code Start */
        // if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
        //   //get mobile number from account number 
        //   const oAccount = await obankaccountModel.findOne({ sAccountNo: newTransaction.sAccountNo });
        //   if (oAccount.sSMSAlert === "Yes") {
        //     const options = {
        //       "method": "POST",
        //       "hostname": "api.msg91.com",
        //       "port": null,
        //       "path": "/api/v5/flow/",
        //       "headers": {
        //         "authkey": "371253At5xrfgrK62b82597P1",
        //         "content-type": "application/JSON"
        //       }
        //     };

        //     const req = http.request(options, function (res) {
        //       const chunks = [];

        //       res.on("data", function (chunk) {
        //         chunks.push(chunk);
        //       });

        //       res.on("end", function () {
        //         const body = Buffer.concat(chunks);
        //         console.log(body.toString());
        //       });
        //     });

        //     //debit message for customers
        //     req.write(`{\n  \"flow_id\": \"61ceee30f6ce631ad9204917\",\n  
        // \"sender\": \"ADPNXT\",\n  
        // \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
        // \"acno\": \"${newTransaction.sAccountNo}\",\n  
        // \"amount\": \"${newTransaction.nCreditAmount}\",\n  
        // \"date\":\"${newTransaction.sDate}\",\n  
        // \"tid\":\"${newTransaction.nTransactionId}\",\n  
        // \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
        //     req.end();
        //   }
        // }
        /* SmS code End */

        oRes.json({ status: "Success", id: newTransaction.nTransactionId });
      }
    }

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);

  }
}));

//url : ..../savingstype/deactivate
oSavingsTypeRouter.post("/deactivate",oAuthentication,asyncMiddleware(async (oReq ,oRes ,oNext) => {
  try {
    let msg = '';
    const oSavingType = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, sIsApproved: oReq.body.sIsApproved, nSavingsId: oReq.body.nSavingsId, sStatus: 'Active' });
    if (!oSavingType) {
      // return oRes.status(400).send("");
      msg = 'Not Exists';
    }else {
      const olasttransaction = await oTransactionModel.find({ nLoanId: oSavingType.nSavingsId, sIsApproved: 'Approved' }).sort({ _id: -1 }).limit(1);
      if (olasttransaction.length > 0) {
        if (olasttransaction[0].nBalanceAmount > 0) {
          // oRes.json("Pending");
          msg = "Pending";
        } else {
          oSavingType.sStatus = 'InActive';
          // await oSavingsTypeModel.findByIdAndUpdate(oSavingType._id, { sStatus : oReq.body.sStatus}, { new: true, runValidators: true });
          oSavingType.save();
          msg = 'Success';
        }
      }else if(olasttransaction.length == 0){
          oSavingType.sStatus = 'InActive';
          oSavingType.save();
          msg = 'Success';
          //msg = 'No Approved Transactions';
      } 
    }

    oRes.json(msg);
  }
  catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../savingstype/edit_savingstype
oSavingsTypeRouter.post("/edit_savingstype", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    const oSavingsType = await oSavingsTypeModel.AndUpdate(oReq.body._id, oReq.body, { new: true, runValidators: true });

    if (!oSavingsType) {
      return oRes.status(400).send();
    }

    oRes.json("Success");
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../savingstype/getallsavingstypecount
oSavingsTypeRouter.get("/getallsavingstypecount", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    let oSavingsType = await oSavingsTypeModel.find();

    if (oSavingsType.length >= 0) {
      oRes.json(oSavingsType.length);
    }
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../savingstype/getallsavingstypebalance
oSavingsTypeRouter.get("/getallsavingstypebalance", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    let oBalance = 0;
    let oSavingsType = await oSavingsTypeModel.find();
    if (oSavingsType.length > 0) {
      await Promise.all(oSavingsType.map(async (oSavings) => {
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId ,sIsApproved : 'Approved'}).sort({ _id: -1 }).limit(1);
        if (olasttransaction.length > 0) {
          oBalance = oBalance + olasttransaction[0].nBalanceAmount;
        }
      }));
    }
    oRes.json(oBalance);

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../savingstype/getsinglesavingtypebalance
oSavingsTypeRouter.post("/getsinglesavingtypebalance", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    let oBalance = 0;
    let oSavingsType = await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, nSavingsId: oReq.body.nSavingsId,sIsApproved : 'Approved', sStatus : 'Active'});
    console.log("savingtype",oSavingsType)
    if (oSavingsType) {
      
        const olasttransaction = await oTransactionModel.find({ nLoanId: oSavingsType.nSavingsId ,sIsApproved : 'Approved'}).sort({ _id: -1 }).limit(1);
        if (olasttransaction.length > 0) {
          oBalance = oBalance + olasttransaction[0].nBalanceAmount;
        }
      
    }
    oRes.json(oBalance);

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));




// url: ..../savingstype/getaccountsavingstypes
oSavingsTypeRouter.post("/getaccountsavingstypes", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    let oSavingsType = await oSavingsTypeModel.find({ sAccountNo: oReq.body.sAccountNo });
    let aSavings = [];

    if (oSavingsType.length > 0) {
      await Promise.all(oSavingsType.map(async (oSavings) => {
        let accountBalance = 0;
        let savings = {
          sSavingsName: '',
          nSavingsBalance: 0
        };
        savings.sSavingsName = oSavings.sTypeofSavings;
        //Get savingstype  last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({ nLoanId: oSavings.nSavingsId,sIsApproved : 'Approved' }).sort({ _id: -1 }).limit(1);

        if (olasttransaction.length > 0) {
          accountBalance = accountBalance + olasttransaction[0].nBalanceAmount;
          savings.nSavingsBalance = accountBalance;
        }
        aSavings.push(savings);

      }));

    }
    oRes.json(aSavings);

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../savingstype/setsavingstypeapprovalstatus
oSavingsTypeRouter.post("/setsavingstypeapprovalstatus", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    let oSavingsType = await oSavingsTypeModel.findOne({ nSavingsId: oReq.body.nSavingsId });
    if (!oSavingsType) {
      return oRes.status(400).send();
    }
    const saving = await oSavingsTypeModel.findByIdAndUpdate(oSavingsType._id, { sIsApproved: oReq.body.sIsApproved, sStatus : oReq.body.sStatus}, { new: true, runValidators: true });
    oRes.json({status : "Success",message : saving.sStatus});

  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../savingstype/delete_savingstype
oSavingsTypeRouter.post("/delete_savingstype", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    console.log(oReq.body._id);
    const oSavingsType = await oSavingsTypeModel.findByIdAndDelete(oReq.body._id);

    if (!oSavingsType) {
      return oRes.status(400).send();
    }

    oRes.json(oSavingsType);
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../savingstype/savingstype_list
oSavingsTypeRouter.post("/savingstype_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    await oSavingsTypeModel.find({ sAccountNo: oReq.body.sAccountNo  })
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllSavingsTypes) => {
        if (!oError) {
          oRes.json(oAllSavingsTypes);
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



// url: ..../savingstype/need_to_approve_savingstype_list
oSavingsTypeRouter.post("/need_to_approve_savingstype_list", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    await oSavingsTypeModel.find({ sIsApproved: "Pending" })
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllSavingsTypes) => {
        if (!oError) {
          oRes.json(oAllSavingsTypes);
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



// url: ..../savingstype/getallsavingtypes
oSavingsTypeRouter.post("/getallsavingtypes", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    await oSavingsTypeModel.find()
      .populate({
        path: 'oTransactionInfo'
      }).exec((oError, oAllSavingTypes) => {
        if (!oError) {
          oRes.json(oAllSavingTypes);
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


// url: ..../savingstype/getallsavingstypeByApproval
oSavingsTypeRouter.post("/getallsavingstypeByApproval", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
    await oSavingsTypeModel.find({ sAccountNo: oReq.body.sAccountNo, sIsApproved: "Approved", sStatus : 'Active' })
      .populate({
        path: 'oTransactionInfo',
        match : { 'sIsApproved' : 'Approved' }
      }).exec((oError, oAllSavingsType) => {
        if (!oError) {
          oRes.json(oAllSavingsType);
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

// url: ..../savingstype/getallclosedsavingstypeByApproval
oSavingsTypeRouter.post("/getallclosedsavingstypeByApproval", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {
   await oSavingsTypeModel.find({ sAccountNo: oReq.body.sAccountNo, sIsApproved: "Approved", sStatus : 'InActive' })
      .populate({
        path: 'oTransactionInfo',
       match : { 'sIsApproved' : 'Approved' }
      }).exec((oError, oAllInActiveSavingsType) => {
        if (!oError) {
          oRes.json(oAllInActiveSavingsType);
        }
        else {
          console.log(oError);
          return oRes.status(400).send({"error" : "No saving deposits found"});
        }
      });
  } catch (e) {
    console.log(e);
    oRes.status(400).send(e);
  }
}));





// url: ..../savingstype/getsavingtype
oSavingsTypeRouter.post("/getsavingtype", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => {
  try {

    // let refIds = []; 
    // const oTransactions = await oTransactionModel.find({sAccountNo: oReq.body.sAccountNo,nLoanId: oReq.body.nAccountId,sIsApproved:'Approved' });
    // await Promise.all(oTransactions.map(async(oItem) => {
    //   refIds.push(oItem.nTransactionId);
    // }));
      
    // await oDailyDepositModel.find({ sAccountNo: oReq.body.sAccountNo })
    //   .populate({
    //     path: 'oTransactionInfo',
    //     match: {'nTransactionId':{$in: refIds}},
    //   }).exec((oError, oAllDeposits) => {
    //     if (!oError) {
    //       oRes.json(oAllDeposits);
    //     }
    //     else {
    //       console.log(oError);
    //       return oRes.status(400).send();
    //     }
    //   });

    await oSavingsTypeModel.findOne({ sAccountNo: oReq.body.sAccountNo, sIsApproved: "Approved", nSavingsId: oReq.body.nSavingsId , sStatus : 'Active' })
      .populate({
        path: 'oTransactionInfo',
        match : { 'sIsApproved' : 'Approved' }
      }).exec((oError, oAllSavingsType) => {
        if (!oError) {
          oRes.json(oAllSavingsType);
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


module.exports = oSavingsTypeRouter;