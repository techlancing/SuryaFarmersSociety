const oExpress = require('express');
const oMongoose = require('mongoose');

const oVillageModel = require("../data_base/models/village.model");

const oVillageRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

// url: ..../Village/add_Village
oVillageRouter.post("/add_village", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newVillage = new oVillageModel(oReq.body);
  try{
    // Save Village Info
    await newVillage.save();    
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../Village/edit_Village
oVillageRouter.post("/edit_village", asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oVillage = await oVillageModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oVillage){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../Village/delete_Village
oVillageRouter.post("/delete_village", asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oVillage = await oVillageModel.findByIdAndDelete(oReq.body._id);

    if(!oVillage){
      return oRes.status(400).send();
    }

    oRes.json(oVillage); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../Village/Village_list
oVillageRouter.get("/village_list", asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllVillages = await oVillageModel.find();

      if(!oAllVillages){
        return oRes.status(400).send();
      }

      oRes.json(oAllVillages);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oVillageRouter;