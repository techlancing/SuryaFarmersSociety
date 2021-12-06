const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oBankEmployeeSchema = new oSchema({
  nEmployeeID : {
    type: String,
    trim : true,
    unique : true
  },
  sAccountNo: { 
    type: String,
    trim: true,
    unique: true
   },
  sEmployeeName: { 
    type: String,
    trim: true
   },
   sReligion: { 
    type: String,
    trim: true
   },
   sNationality: {
    type: String,
    trim: true
  },

  sSpeakLanguage: { 
    type: String,
    trim: true,
   },//unique: true},
  sFatherOrHusbandName: {
    type: String,
    trim: true
  },
  sMotherName: {
    type: String,
    trim: true
  },
  sMobileNumber: {
    type: String,
    trim: true
  },
  sEmployeeCallLetterID: {
    type: String,
    trim: true
  },
  sCallLetterIssuedDate: {
    type: String,
    trim: true
  },
  sAppointmentType: {
    type: String,
    trim: true
  },
  sDesignation: {
    type: String,
    trim: true
  },
  sIFSCCode: {
    type: String,
    trim: true
  },
  sBranchName: {
    type: String,
    trim: true
  },
  sPlace: {
    type: String,
    trim: true
  },
  sAadharNo: {
    type: String,
    trim: true
  },
  sJoiningDate: {
    type: String,
    trim: true
  },
  oPassportImageInfo: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oEmployeePhotoUpload: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oBankPassBookUpload: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oCallLetterUpload: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oAadharUpload: {type: oSchema.Types.ObjectId, ref: 'Image'}
});
//oBankEmployeeSchema.plugin(oAutoIncrement, { inc_field: 'nEmployeeID', inc_amount: 1, start_seq: 500 });


module.exports = oMongoose.model("BankEmployee", oBankEmployeeSchema);




