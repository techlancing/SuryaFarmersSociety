const oExpress = require('express');
const oMongoose = require('mongoose');

const oMandalModel = require("../data_base/models/mandal.model");

const oMandalRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

// url: ..../Mandal/add_Mandal
oMandalRouter.post("/add_mandal", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newMandal = new oMandalModel(oReq.body);
  try{
    // Save Mandal Info
    await newMandal.save();    
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../Mandal/edit_Mandal
oMandalRouter.post("/edit_mandal", asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oMandal = await oMandalModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oMandal){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../Mandal/delete_Mandal
oMandalRouter.post("/delete_mandal", asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oMandal = await oMandalModel.findByIdAndDelete(oReq.body._id);

    if(!oMandal){
      return oRes.status(400).send();
    }

    oRes.json(oMandal); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../Mandal/Mandal_list
oMandalRouter.get("/mandal_list", asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllMandals = await oMandalModel.find();

      if(!oAllMandals){
        return oRes.status(400).send();
      }

      oRes.json(oAllMandals);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oMandalRouter;