const oExpress = require('express');
const oMongoose = require('mongoose');

const oDistrictModel = require("../data_base/models/district.model");

const oDistrictRouter = oExpress.Router();

//To remove unhandled promise rejections
const asyncMiddleware = fn =>
  (oReq, oRes, oNext) => {
    Promise.resolve(fn(oReq, oRes, oNext))
      .catch(oNext);
  };

// url: ..../District/add_District
oDistrictRouter.post("/add_district", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newDistrict = new oDistrictModel(oReq.body);
  try{
    // Save District Info
    await newDistrict.save();    
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../District/edit_District
oDistrictRouter.post("/edit_district", asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oDistrict = await oDistrictModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oDistrict){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../District/delete_District
oDistrictRouter.post("/delete_district", asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oDistrict = await oDistrictModel.findByIdAndDelete(oReq.body._id);

    if(!oDistrict){
      return oRes.status(400).send();
    }

    oRes.json(oDistrict); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../District/District_list
oDistrictRouter.get("/district_list", asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllDistricts = await oDistrictModel.find();

      if(!oAllDistricts){
        return oRes.status(400).send();
      }

      oRes.json(oAllDistricts);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oDistrictRouter;