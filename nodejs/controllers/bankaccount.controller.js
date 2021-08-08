const oExpress = require('express');
const oMongoose = require('mongoose');
const multer = require('multer');
var path = require('path');
var fs = require('fs');

const obankaccountModel = require("../data_base/models/bankaccount.model");
const oImageModel = require("../data_base/models/image.model");
const oTransactionModel = require("../data_base/models/transaction.model");

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
obankaccountRouter.post("/add_bankaccount", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newbankaccount = new obankaccountModel(oReq.body);
  try{
    // Save bankaccount Info
    await newbankaccount.save(); 
    
    //save transaction model
    let oTransaction = {};
    oTransaction.sAccountNo = newbankaccount.sAccountNo;
    oTransaction.nLoanId = newbankaccount.nAccountId;
    oTransaction.nCreditAmount = newbankaccount.nAmount;
    oTransaction.nDebitAmount = 0;
    oTransaction.nBalanceAmount = newbankaccount.nAmount;
    oTransaction.sDate = newbankaccount.sDate;
    oTransaction.sNarration = "new account created";  
    
    const newTransaction = new oTransactionModel(oTransaction);
    await newTransaction.save();

    newbankaccount.oTransactionInfo = newTransaction._id;
    await newbankaccount.save();

    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../bankaccount/edit_bankaccount
obankaccountRouter.post("/edit_bankaccount", asyncMiddleware(async(oReq, oRes, oNext) => {
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
obankaccountRouter.post("/delete_bankaccount", asyncMiddleware(async (oReq, oRes, oNext) => { 
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
obankaccountRouter.get("/bankaccount_list", asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllbankaccounts = await obankaccountModel.find();

      if(!oAllbankaccounts){
        return oRes.status(400).send();
      }

      oRes.json(oAllbankaccounts);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

// url: ..../bankaccount/getallsavingstransactions
obankaccountRouter.post("/getallsavingstransactions", asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    let oAllTransactions = await oTransactionModel.find({nLoanId : oReq.body.nAccountId})
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

// url: ..../bankaccount/getaccountbynumber
obankaccountRouter.post("/getaccountbynumber", asyncMiddleware(async(oReq, oRes, oNext) => {
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


// url: ..../bankaccount/getlastaccountinvillage
obankaccountRouter.post("/getlastaccountinvillage", asyncMiddleware(async(oReq, oRes, oNext) => {
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