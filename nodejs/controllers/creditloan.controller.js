const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const obankaccountModel = require("../data_base/models/bankaccount.model");
const oCreditLoanModel = require("../data_base/models/creditloan.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");
const scheduler = require('../scheduler');

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
    const oCreditLoan = await oCreditLoanModel.findOne({ sAccountNo: oReq.body.sAccountNo,sTypeofLoan: oReq.body.sTypeofLoan,sIsApproved : 'Approved', sLoanStatus : 'Active'});
    if (oCreditLoan) {
      return oRes.json("Exists").send();
    }
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
    // oTransaction.sNarration = newCreditLoan.sTypeofLoan;
    let type = newCreditLoan.sTypeofLoan.split(" ");
    oTransaction.sNarration = type.length >2? type[0]+"_"+type[1]+"_"+type[3] : type[0]+"_"+type[1];
    oTransaction.sAccountType = newCreditLoan.sTypeofLoan;
    oTransaction.sEmployeeName = newCreditLoan.sEmployeeName;
    oTransaction.sIsApproved = 'Pending';
    
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    //push transaction info and again save credit loan
    newCreditLoan.oTransactionInfo = newTransaction._id;
    newCreditLoan.sLoanStatus = "InActive";
    await newCreditLoan.save();
/* SmS code Start */
  //   if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES") {
  //     //get mobile number from account number 
  //     const oAccount = await obankaccountModel.findOne({ sAccountNo: newTransaction.sAccountNo });
  //     if (oAccount.sSMSAlert === "Yes") {
  //       const options = {
  //         "method": "POST",
  //         "hostname": "api.msg91.com",
  //         "port": null,
  //         "path": "/api/v5/flow/",
  //         "headers": {
  //           "authkey": "371253At5xrfgrK62b82597P1",
  //           "content-type": "application/JSON"
  //         }
  //       };

  //       const req = http.request(options, function (res) {
  //         const chunks = [];

  //         res.on("data", function (chunk) {
  //           chunks.push(chunk);
  //         });

  //         res.on("end", function () {
  //           const body = Buffer.concat(chunks);
  //           console.log(body.toString());
  //         });
  //       });

  //       //debit message for customers
  //       req.write(`{\n  \"flow_id\": \"6205fac89240634a2976bac2\",\n  
  // \"sender\": \"ADPNXT\",\n  
  // \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
  // \"acno\": \"${newTransaction.sAccountNo}\",\n  
  // \"amount\": \"${newTransaction.nCreditAmount}\",\n  
  // \"date\":\"${newTransaction.sDate}\",\n  
  // \"tid\":\"${newTransaction.nTransactionId}\",\n  
  // \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
  //       req.end();
  //     }
  //   }
/* SmS code End */
    oRes.json({status : "Success",id : newTransaction.nTransactionId});

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

}));

// url: ..../creditloan/getallcreditloancount
oCreditLoanRouter.get("/getallcreditloancount", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oCreditloan = await oCreditLoanModel.find();

    if(oCreditloan.length >= 0){
      oRes.json(oCreditloan.length);
    } 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../creditloan/getallcreditloanbalance
oCreditLoanRouter.get("/getallcreditloanbalance", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oBalance = 0;
    let oCreditLoan = await oCreditLoanModel.find();
    if(oCreditLoan.length > 0){
      await Promise.all(oCreditLoan.map(async (oLoan) => {
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oLoan.nLoanId,sIsApproved : 'Approved'}).sort({_id:-1}).limit(1);
      if(olasttransaction.length > 0) {
          oBalance = oBalance + olasttransaction[0].nBalanceAmount;
        }
      }));
    } 
    oRes.json(oBalance);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));


// url: ..../creditloan/setcreditloanapprovalstatus
oCreditLoanRouter.post("/setcreditloanapprovalstatus", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oBalance = 0;
    let oCreditLoan = await oCreditLoanModel.findOne({nLoanId: oReq.body.nLoanId});
    if(!oCreditLoan){
      return oRes.status(400).send({error : 'This Loan does not exists'});
    }
    const loan = await oCreditLoanModel.findByIdAndUpdate(oCreditLoan._id,{sIsApproved: oReq.body.sIsApproved,sLoanStatus : oReq.body.sLoanStatus},{ new: true, runValidators : true});
    oRes.json({status : "Success",message : loan.sLoanStatus});  

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));


// url: ..../creditloan/getaccountcreditloans
oCreditLoanRouter.post("/getaccountcreditloans", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oCreditLoan = await oCreditLoanModel.find( {sAccountNo : oReq.body.sAccountNo, sIsApproved: "Approved",sLoanStatus : 'Active'});
    let aLoans = [];
    
    if(oCreditLoan.length > 0){
      await Promise.all(oCreditLoan.map(async (oLoan) => {
        let accountBalance = 0;
        let loans = {
          sLoanName :'',
          nLoanBalance : 0
        };
        loans.sLoanName = oLoan.sTypeofLoan;
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oLoan.nLoanId, sIsApproved : 'Approved'}).sort({_id:-1}).limit(1);
      
        if(olasttransaction.length > 0) {
            accountBalance = accountBalance + olasttransaction[0].nBalanceAmount;
            loans.nLoanBalance = accountBalance;
          }
        aLoans.push(loans);

      }));

     }
    oRes.json(aLoans);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));



// Listen for the 'scheduledTask' event and execute a function when it occurs
scheduler.on('scheduledTask', async() => {
  
  try{
    let oCreditLoan = await oCreditLoanModel.find( { sIsApproved: "Approved",sLoanStatus : 'Active'});
    
    if(oCreditLoan.length > 0){
      await Promise.all(oCreditLoan.map(async (oLoan) => {
        let accountBalance = 0;
        let loans = {
          sLoanName :'',
          nLoanBalance : 0
        };
        let todayDate = new Date(); 
        let tempDate = oLoan.sEndofLoanDate.split('-').reverse().join('-') + ' 0:00:00';
        loanendDate = new Date(tempDate);
        //If date exceeds the loan end date
        if(todayDate > loanendDate && (oLoan.sPenaltyDate === '') ){
          let tempPenaltyDate = oLoan.sEndofLoanDate.split('-').reverse().join('-') + ' 0:00:00';
          let temploanPenaltyDate = new Date(tempPenaltyDate);
          let month = new Date(temploanPenaltyDate).getMonth();
          if(month === 11){
            let year = new Date(temploanPenaltyDate).getFullYear();
            year = year + 1;
            let newDate = new Date(temploanPenaltyDate).setFullYear(year,0);
            const yr = new Date(newDate).getFullYear();
            const mon = String(new Date(newDate).getMonth() + 1).padStart(2, '0'); // Months are zero-based
            
            const day = String(new Date(newDate).getDate()).padStart(2, '0');
            
            //transactiondate =  `${day}-${mon}-${yr}`;
            if(day > Number(28)){
              oLoan.sPenaltyDate = `28-${mon}-${yr}`;
            }else{
              oLoan.sPenaltyDate = `${day}-${mon}-${yr}`;
            }
            
          }else{
            let year = new Date(temploanPenaltyDate).getFullYear();
              
              let newDate = new Date(temploanPenaltyDate).setFullYear(year,month);
              const yr = new Date(newDate).getFullYear();
              const mon = String(new Date(newDate).getMonth() + 2).padStart(2, '0'); // Months are zero-based
              
              const day = String(new Date(newDate).getDate()).padStart(2, '0');

              if(month === 0){
                oLoan.sPenaltyDate = `28-${mon}-${yr}`;
              }else{
                oLoan.sPenaltyDate = `${day}-${mon}-${yr}`;
              }
              
              
          }
          
          await oLoan.save();
        }
        if(oLoan.sPenaltyDate !== ''){
          let tempPenaltyDate = oLoan.sPenaltyDate.split('-').reverse().join('-') + ' 0:00:00';
          loanPenaltyDate = new Date(tempPenaltyDate);
          
          if(todayDate > loanPenaltyDate ){
            loans.sLoanName = oLoan.sTypeofLoan;
            //Get credit loan last transacton for balance amount
            const olasttransaction = await oTransactionModel.find({nLoanId: oLoan.nLoanId, sIsApproved : 'Approved'}).sort({_id:-1}).limit(1);
            if(olasttransaction.length > 0) {
                accountBalance = accountBalance + olasttransaction[0].nBalanceAmount;
                loans.nLoanBalance = accountBalance;
                if (accountBalance > 0) {
                  
                    let month = new Date(loanPenaltyDate).getMonth();
                    let transactiondate = '';
                    if(month === 11){
                      let year = new Date(loanPenaltyDate).getFullYear();
                      year = year + 1;
                      let newDate = new Date(loanPenaltyDate).setFullYear(year,0);
                      const yr = new Date(newDate).getFullYear();
                      const mon = String(new Date(newDate).getMonth() + 1).padStart(2, '0'); // Months are zero-based
                      
                      const day = String(new Date(newDate).getDate()).padStart(2, '0');
                      
                      
                      if(day > Number(28)){
                        oLoan.sPenaltyDate = `28-${mon}-${yr}`;
                      }else{
                        oLoan.sPenaltyDate = `${day}-${mon}-${yr}`;
                      }
                      
                      transactiondate =  `${day}-${Number(month)+1}-${Number(year)-1}`;
                      
                    }
                    else{
                      let year = new Date(loanPenaltyDate).getFullYear();
                      
                      let newDate = new Date(loanPenaltyDate).setFullYear(year,month);
                      const yr = new Date(newDate).getFullYear();
                      const mon = String(new Date(newDate).getMonth() + 2).padStart(2, '0'); // Months are zero-based
                      
                      const day = String(new Date(newDate).getDate()).padStart(2, '0');

                      if(month === 0){
                        oLoan.sPenaltyDate = `28-${mon}-${yr}`;
                      }else{
                        oLoan.sPenaltyDate = `${day}-${mon}-${yr}`;
                      }
                      
                      
                      transactiondate =  `${day}-${Number(month)+1}-${year}`;
                      
                    }
                  //}
                  //save transaction model
                  let oTransaction = {};
                  oTransaction.sAccountNo = oLoan.sAccountNo;
                  oTransaction.nLoanId = oLoan.nLoanId;
                  oTransaction.nCreditAmount = olasttransaction[0].nBalanceAmount * oLoan.nIntrest/100 * 1/12;
                  oTransaction.nDebitAmount = 0;
                  oTransaction.nBalanceAmount = olasttransaction[0].nBalanceAmount + oTransaction.nCreditAmount;
                  oTransaction.sDate = transactiondate;
                  // oTransaction.sNarration = newCreditLoan.sTypeofLoan;
                  let type = oLoan.sTypeofLoan.split(" ");
                  oTransaction.sNarration = 'Monthly_Intrest';
                  oTransaction.sAccountType = oLoan.sTypeofLoan;
                  oTransaction.sEmployeeName = oLoan.sEmployeeName;
                  oTransaction.sIsApproved = 'Approved';


                  const newTransaction = new oTransactionModel(oTransaction);
                  await newTransaction.save();

                  //push transaction info and again save credit loan
                  oLoan.oTransactionInfo.push(newTransaction._id);
                  oLoan.sLoanStatus = "Active";
                  await oLoan.save();
                }
              }
              //Add interest
        
            
              
          }
      }
        

      }));

     }

  }catch(e){
    console.log(e);
    //oRes.status(400).send(e);
  } 
});

// url: ..../creditloan/addinteresttransactiontoaccountcreditloans
oCreditLoanRouter.get("/addinteresttransactiontoaccountcreditloans",  asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oCreditLoan = await oCreditLoanModel.find( {sAccountNo : '010101010002'/*oReq.body.sAccountNo*/, sIsApproved: "Approved",sLoanStatus : 'Active'});
    
    if(oCreditLoan.length > 0){
      await Promise.all(oCreditLoan.map(async (oLoan) => {
        let accountBalance = 0;
        let loans = {
          sLoanName :'',
          nLoanBalance : 0
        };
        loans.sLoanName = oLoan.sTypeofLoan;
        //Get credit loan last transacton for balance amount
        const olasttransaction = await oTransactionModel.find({nLoanId: oLoan.nLoanId, sIsApproved : 'Approved'}).sort({_id:-1}).limit(1);
      
        if(olasttransaction.length > 0) {
            accountBalance = accountBalance + olasttransaction[0].nBalanceAmount;
            loans.nLoanBalance = accountBalance;
          }
          //Add interest
    
        //save transaction model
        let oTransaction = {};
        oTransaction.sAccountNo = oLoan.sAccountNo;
        oTransaction.nLoanId = oLoan.nLoanId;
        oTransaction.nCreditAmount = oLoan.nTotalAmount;
        oTransaction.nDebitAmount = 0;
        oTransaction.nBalanceAmount = oLoan.nTotalAmount;
        oTransaction.sDate = oLoan.sDate;
        // oTransaction.sNarration = newCreditLoan.sTypeofLoan;
        let type = oLoan.sTypeofLoan.split(" ");
        oTransaction.sNarration = type.length >2? type[0]+"_"+type[1]+"_"+type[3] : type[0]+"_"+type[1];
        oTransaction.sAccountType = oLoan.sTypeofLoan;
        oTransaction.sEmployeeName = oLoan.sEmployeeName;
        oTransaction.sIsApproved = 'Approved';
        
        
        const newTransaction = new oTransactionModel(oTransaction);
        await newTransaction.save();

        //push transaction info and again save credit loan
        oLoan.oTransactionInfo.push(newTransaction._id);
        oLoan.sLoanStatus = "Active";
        await oLoan.save();
            

      }));

     }

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));



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

// url: ..../creditloan/getallcreditloans
oCreditLoanRouter.post("/getallcreditloans", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await oCreditLoanModel.find()
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


//url : ..../creditloan/deactivate
oCreditLoanRouter.post("/deactivate",oAuthentication,asyncMiddleware(async (oReq ,oRes ,oNext) => {
  try{
    //let oCreditLoan = await oCreditLoanModel.findOne({sAccountNo : oReq.body.sAccountNo, sIsApproved: "Approved",nLoanId : oReq.body.nLoanId, sLoanStatus : 'Active'});
    const oCreditLoan = await oCreditLoanModel.findOne({sAccountNo : oReq.body.sAccountNo ,nLoanId : oReq.body.nLoanId, sIsApproved: "Approved", sLoanStatus : 'Active'});
    if(!oCreditLoan) {
      return oRes.status(400).send({error : 'CreditLoan does not exist'});
    }
    
    const olasttransaction = await oTransactionModel.find({ sAccountNo : oCreditLoan.sAccountNo,nLoanId: oCreditLoan.nLoanId,sIsApproved : 'Approved' }).sort({ _id: -1 }).limit(1);

    if (olasttransaction.length > 0) {
      if(olasttransaction[0].nBalanceAmount !== 0){
       oRes.json("Pending").send();
      }
      else {
        oCreditLoan.sLoanStatus = 'InActive' ;
        oCreditLoan.save();
      }
    }
    else if(olasttransaction.length  == 0){
      oCreditLoan.sLoanStatus = 'InActive' ;
        oCreditLoan.save();
    }
     oRes.json("Success");
  }
  catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));





// url: ..../creditloan/need_to_approve_getallcreditloans
oCreditLoanRouter.post("/need_to_approve_getallcreditloans", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await oCreditLoanModel.find({sIsApproved: "Pending"})
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





// url: ..../creditloan/getallcreditloansByApproval
oCreditLoanRouter.post("/getallcreditloansByApproval", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await oCreditLoanModel.find({sAccountNo : oReq.body.sAccountNo,sIsApproved: "Approved", sLoanStatus : 'Active'})
    .populate({
      path: 'oTransactionInfo',
      match : { 'sIsApproved' : 'Approved' }
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


// url: ..../creditloan/getclosedallcreditloans
oCreditLoanRouter.post("/getclosedallcreditloans", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await oCreditLoanModel.find({sAccountNo : oReq.body.sAccountNo,sIsApproved: "Approved", sLoanStatus : 'InActive'})
    .populate({
      path: 'oTransactionInfo',
      match : { 'sIsApproved' : 'Approved' }
    }).exec((oError, oAllCreditLoans) => {
      if(!oError) {
          oRes.json(oAllCreditLoans);
      }
      else{
          console.log(oError);
          return oRes.status(400).send({"error" : "No creditloans found"});
      }
    });
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));




module.exports = oCreditLoanRouter;