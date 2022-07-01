const oExpress = require('express');
const oMongoose = require('mongoose');
const http = require('https');
const multer = require('multer');
var path = require('path');
var fs = require('fs');

const obankaccountModel = require("../data_base/models/bankaccount.model");
const oImageModel = require("../data_base/models/image.model");
const oTransactionModel = require("../data_base/models/transaction.model");
const oAuthentication = require("../middleware/authentication");


const obankaccountRouter = oExpress.Router();
// SET STORAGE for  uploading images
var storage = multer.diskStorage({
  destination: function (oReq, oFile, cb) {
    try {
      //console.dir(oReq);
      console.log('reached disk storage function');
      var folderPath = path.join(process.env.UPLOAD_PATH, 'bankaccount');
      console.log(folderPath);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log('Path does not exists, created the folder');
      }
      else
        console.log('Path exists');

      cb(null, folderPath);
    } catch (e) {
      console.log(e);
    }

  },
  filename: function (oReq, oFile, cb) {
    try {
      cb(null, oFile.originalname);
    } catch (e) {
      console.log(e);
    }
  }
});
 
var oUploadImage = multer({ storage: storage });
//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

  // Upload images
  obankaccountRouter.post("/upload_file", oUploadImage.array('file', 1), asyncMiddleware(async (req, res, oNext) => { 
    if(req.files)
    {
      const files = req.files;
      const oNewfile = new oImageModel();
      oNewfile.sImageName = files[0].filename;
      oNewfile.sImageURL =  path.join(files[0].destination.substr(7, files[0].destination.length-1),files[0].filename);
      oNewfile.sImageType = files[0].mimetype;
      try{
        const oUpdatedfile = await oNewfile.save();
        if(!oUpdatedfile){
          return oRes.status(400).send();
        }
        res.json({'oImageRefId' : oUpdatedfile._id});
      }catch(e){
        console.log(e);
        console.log('Failure in empty image');
        res.json({'error' : 'Failure in empty image'});
      }
      
      
    }
  }));
  

// url: ..../bankaccount/add_bankaccount
obankaccountRouter.post("/add_bankaccount", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newbankaccount = new obankaccountModel(oReq.body);
  try{
    // Save bankaccount Info
    await newbankaccount.save(); 
    newbankaccount.bIsDeactivated = false;
    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newbankaccount.sAccountNo;
    oTransaction.nLoanId = newbankaccount.nAccountId;
    oTransaction.nCreditAmount = 0;
    oTransaction.nDebitAmount = newbankaccount.nAmount;
    oTransaction.nBalanceAmount = newbankaccount.nAmount;
    oTransaction.sDate = newbankaccount.sDate;
    oTransaction.sNarration = "NewAccountCreated";
    oTransaction.sAccountType = 'Savings Account';
    oTransaction.sEmployeeName = newbankaccount.sEmployeeName;
    oTransaction.sIsApproved = 'Pending';
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    newbankaccount.oTransactionInfo = newTransaction._id;
    await newbankaccount.save();
    /* SmS code Start */
    // if (process.env.IS_PRODUCTION === "YES" && process.env.IS_STAGING === "YES"){
    //   const oAccount = await obankaccountModel.findOne({sAccountNo: newTransaction.sAccountNo});
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
    //     //get mobile number from account number 

    //     //credit message for customers
    //     req.write(`{\n  \"flow_id\": \"6205fa53b73c4376f32e3344\",\n  
    //   \"sender\": \"ADPNXT\",\n  
    //   \"mobiles\": \"91${oAccount.sMobileNumber}\",\n  
    //   \"acno\": \"${newTransaction.sAccountNo}\",\n  
    //   \"amount\": \"${newTransaction.nDebitAmount}\",\n  
    //   \"date\":\"${newTransaction.sDate}\",\n  
    //   \"tid\":\"${newTransaction.nTransactionId}\",\n  
    //   \"bal\":\"${newTransaction.nBalanceAmount}\"\n}`);
    //     req.end();
    //   }
    // }
    /* SmS code End */
    oRes.json("Success");

  }catch(e){
    console.log(e); //{"driver": e.driver,"name":e.name,"error_code":e.code}
    if(e.code === 11000) oRes.json(e);
    else  oRes.status(400).send(e);
  }
}));

// url: ..../bankaccount/edit_bankaccount
obankaccountRouter.post("/edit_bankaccount", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const obankaccount = await obankaccountModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!obankaccount){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../bankaccount/delete_bankaccount
obankaccountRouter.post("/delete_bankaccount", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const obankaccount = await obankaccountModel.findByIdAndDelete(oReq.body._id);

    if(!obankaccount){
      return oRes.status(400).send();
    }

    oRes.json(obankaccount); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

obankaccountRouter.get("/test", asyncMiddleware(async(oReq, oRes, oNext) => {
  oRes.json('success');
}));

// url: ..../bankaccount/bankaccount_list
obankaccountRouter.get("/allbankaccount_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await obankaccountModel.find()
    .populate({
      path: 'oPassportImageInfo oSignature1Info oSignature2Info oDocument1Info oDocument2Info'
    }).exec((oError, oAllbankaccounts) => {
      if(!oError) {
          oRes.json(oAllbankaccounts);
      }
      else{
          console.log(oError);
      }

    });

    
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../bankaccount/activebankaccount_list
obankaccountRouter.get("/activebankaccount_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      await obankaccountModel.find({bIsDeactivated : false})
      .populate({
        path: 'oPassportImageInfo oSignature1Info oSignature2Info oDocument1Info oDocument2Info'
      }).exec((oError, oAllbankaccounts) => {
        if(!oError) {
            oRes.json(oAllbankaccounts);
        }
        else{
            console.log(oError);
        }

      });

      
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

// url: ..../bankaccount/activate_or_deactivate_account
obankaccountRouter.post("/activate_or_deactivate_account", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oAccount = await obankaccountModel.findOne({sAccountNo : oReq.body.sAccountNo});
    if(oAccount) {
      oAccount.bIsDeactivated = oReq.body.bIsDeactivated;
      await oAccount.save();
      oRes.json('success');
    }
    else{
        return oRes.status(400).send();
    }    
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../bankaccount/getallsavingstransactions
obankaccountRouter.post("/getallsavingstransactions", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oAllTransactions = await oTransactionModel.find({nLoanId : oReq.body.nAccountId , sIsApproved : 'Approved'})
      if(oAllTransactions) {
          oRes.json(oAllTransactions);
      }
      else{
          console.log(oError);
          return oRes.status(400).send();
      }
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../bankaccount/getallsavingsaccountcount
obankaccountRouter.get("/getallsavingsaccountcount", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let obankaccount = await obankaccountModel.find({bIsDeactivated : false});

    if(obankaccount.length >= 0){
      oRes.json(obankaccount.length);
    } 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../bankaccount/getallsavingsaccountbalance
obankaccountRouter.get("/getallsavingsaccountbalance", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let accountBalance = 0;
    let obankaccount = await obankaccountModel.find({bIsDeactivated : false});

    if(obankaccount.length > 0){
      await Promise.all(obankaccount.map(async (oAccount) => {
        accountBalance = accountBalance + oAccount.nAmount;
      }));
    } 
    oRes.json(accountBalance);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

// url: ..../bankaccount/getsingleaccountbalance
obankaccountRouter.post("/getsingleaccountbalance", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let accountBalance = 0;
    let oBankaccount = await obankaccountModel.findOne({bIsDeactivated : false, sAccountNo : oReq.body.sAccountNo});
    const olasttransaction = await oTransactionModel.find({ nLoanId: oBankaccount.nAccountId , sIsApproved : 'Approved'}).sort({ _id: -1 }).limit(1);
      

    if(!oBankaccount){
      return oRes.status(400).send();
    }else{
      if (olasttransaction.length > 0) {
        accountBalance = olasttransaction[0].nBalanceAmount;
      }
     // accountBalance = obankaccount.nAmount; 
    }
    oRes.json(accountBalance);

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  
}));

// url: ..../bankaccount/getaccountbynumber
obankaccountRouter.post("/getaccountbynumber", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    await obankaccountModel.findOne({sAccountNo : oReq.body.sAccountNo})
    .populate({
        path: 'oPassportImageInfo oSignature1Info oSignature2Info oDocument1Info oDocument2Info'
      }).exec((oError, oAccountbyid) => {
        if(!oError) {
            oRes.json(oAccountbyid);
        }
        else{
            console.log(oError);
        }

      });
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

// url: ..../bankaccount/getequalaccountscount
obankaccountRouter.get("/getequalaccountscount", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let obankaccount = await obankaccountModel.find({bIsDeactivated : false});
    let nEqualAccounts = 0;
    if(obankaccount.length >= 0){
      await Promise.all(obankaccount.map(async (oAccount) => {
      let oTransaction = await oTransactionModel.find({nAccountId : oAccount.nAccountId,sIsApproved : 'Approved'});
        if(oTransaction.length == 1)
          nEqualAccounts = nEqualAccounts + 1;
      }));
      oRes.json(nEqualAccounts);
    } 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../bankaccount/getlastaccountinvillage
obankaccountRouter.post("/getlastaccountinvillage", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    console.log(oReq.body.nVillageId);
    const olastacc = await obankaccountModel.find({nVillageId: oReq.body.nVillageId}).sort({_id:-1}).limit(1);
    console.log(olastacc[0]);
    if(olastacc.length > 0) {
      oRes.json({accno:olastacc[0].sAccountNo});
     // oRes.send("Success");
  }else {
    oRes.json({accno:001});
  }
    /*.then((oLastaccount)  => {
      
      
    });*/
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }
}));

module.exports = obankaccountRouter;