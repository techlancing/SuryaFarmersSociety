const oExpress = require('express');
const oMongoose = require('mongoose');
const multer = require('multer');
var path = require('path');
var fs = require('fs');

const oCarModel = require("../data_base/models/car.model");
const oImageModel = require("../data_base/models/image.model");

const oCarRouter = oExpress.Router();
// SET STORAGE for  uploading images
var storage = multer.diskStorage({
  destination: function (oReq, oFile, cb) {
    try {
      //console.dir(oReq);
      console.log('reached disk storage function');
      var folderPath = path.join(process.env.UPLOAD_PATH, 'car');
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
  oCarRouter.post("/upload_file", oUploadImage.array('file', 1), asyncMiddleware(async (req, res, oNext) => { 
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
  

// url: ..../Car/add_Car
oCarRouter.post("/add_car", asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newCar = new oCarModel(oReq.body);
  try{
    // Save Car Info
    await newCar.save();    
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../car/edit_car
oCarRouter.post("/edit_car", asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oCar = await oCarModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oCar){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../Car/delete_Car
oCarRouter.post("/delete_car", asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oCar = await oCarModel.findByIdAndDelete(oReq.body._id);

    if(!oCar){
      return oRes.status(400).send();
    }

    oRes.json(oCar); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

oCarRouter.get("/test", asyncMiddleware(async(oReq, oRes, oNext) => {
  oRes.json('success');
}));

// url: ..../Car/Car_list
oCarRouter.get("/car_list", asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllCars = await oCarModel.find();

      if(!oAllCars){
        return oRes.status(400).send();
      }

      oRes.json(oAllCars);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));

module.exports = oCarRouter;