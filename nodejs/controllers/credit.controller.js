const oExpress = require('express');
const oMongoose = require('mongoose');

const oCreditModel = require("../data_base/models/credit.model");

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