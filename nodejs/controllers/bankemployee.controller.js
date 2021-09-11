const oExpress = require('express');
const oMongoose = require('mongoose');
const multer = require('multer');
var path = require('path');
var fs = require('fs');

const oBankEmployeeModel = require("../data_base/models/bankemployee.model");
const oImageModel = require("../data_base/models/image.model");
const oAuthentication = require("../middleware/authentication");


const oBankEmployeeRouter = oExpress.Router();
// SET STORAGE for  uploading images
var storage = multer.diskStorage({
  destination: function (oReq, oFile, cb) {
    try {
      //console.dir(oReq);
      console.log('reached disk storage function');
      var folderPath = path.join(process.env.UPLOAD_PATH, 'bankemployee');
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
  oBankEmployeeRouter.post("/upload_file", oUploadImage.array('file', 1), asyncMiddleware(async (req, res, oNext) => { 
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
  

// url: ..../bankemployee/add_bankemployee
oBankEmployeeRouter.post("/add_bankemployee", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  const newBankEmployee = new oBankEmployeeModel(oReq.body);
  try{
    // Save bank employee Info
    await newBankEmployee.save();    
    oRes.json("Success");

  }catch(e){
    console.log(e);
    oRes.status(400).send(e);

  }
}));

// url: ..../bankemployee/edit_bankemployee
oBankEmployeeRouter.post("/edit_bankemployee", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
  try{
    const oBankEmployee = await oBankEmployeeModel.findByIdAndUpdate(oReq.body._id, oReq.body, { new: true, runValidators : true});

    if(!oBankEmployee){
      return oRes.status(400).send();
    }

    oRes.json("Success"); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }

}));

// url: ..../bankemployee/delete_bankemployee
oBankEmployeeRouter.post("/delete_bankemployee", oAuthentication, asyncMiddleware(async (oReq, oRes, oNext) => { 
  try{
    console.log(oReq.body._id);
    const oBankEmployee = await oBankEmployeeModel.findByIdAndDelete(oReq.body._id);

    if(!oBankEmployee){
      return oRes.status(400).send();
    }

    oRes.json(oBankEmployee); 
  }catch(e){
    console.log(e);
    oRes.status(400).send(e);
  }  

}));

// url: ..../bankemployee/bankemployee_list
oBankEmployeeRouter.get("/bankemployee_list", oAuthentication, asyncMiddleware(async(oReq, oRes, oNext) => {
    try{
      const oAllBankEmployees = await oBankEmployeeModel.find();

      if(!oAllBankEmployees){
        return oRes.status(400).send();
      }

      oRes.json(oAllBankEmployees);
    }catch(e){
      console.log(e);
      oRes.status(400).send(e);
    }
}));


module.exports = oBankEmployeeRouter;