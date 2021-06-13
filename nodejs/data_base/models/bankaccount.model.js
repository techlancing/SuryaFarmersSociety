const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oBankAccountSchema = new oSchema({
  nAccountId : {type: Number},
  sBranchCode: { 
    type: String,
    trim: true
   },
  sAccountNo: { 
    type: String,
    trim: true
   },//unique: true},
  sState: {
    type: String,
    trim: true
  },
  sDistrict: {
    type: String,
    trim: true
  },
  sMandal: {
    type: String,
    trim: true
  },
  sVillage: {
    type: String,
    trim: true
  },
  sCustomerId: {
    type: String,
    trim: true
  },
  sDate: {
    type: String,
    trim: true
  },
  sApplicantName: {
    type: String,
    trim: true
  },
  sApplicantSurName: {
    type: String,
    trim: true
  },
  sGender: {
    type: String,
    trim: true
  },
  sDOB: {
    type: String,
    trim: true
  },
  sAge: {
    type: String,
    trim: true
  },
  sAccountType: {
    type: String,
    trim: true
  },
  sAccountCategory: {
    type: String,
    trim: true
  },
  sShareType: {
    type: String,
    trim: true
  },
  sFatherOrHusbandName: {
    type: String,
    trim: true
  },
  sMotherName: {
    type: String,
    trim: true
  },
  sNomineeName: {
    type: String,
    trim: true
  },
  sNomineeRelationship: {
    type: String,
    trim: true
  },
  sVoterIdNo: {
    type: String,
    trim: true
  },
  sAadharNo: {
    type: String,
    trim: true
  },
  sRationCardNo: {
    type: String,
    trim: true
  },
  sFlatNo: {
    type: String,
    trim: true
  },
  sStreetName: {
    type: String,
    trim: true
  },
  sVillageAddress: {
    type: String,
    trim: true
  },
  sMandalAddress: {
    type: String,
    trim: true
  },
  sDistrictAddress: {
    type: String,
    trim: true
  },
  sPinCode: {
    type: String,
    trim: true
  },
  sMobileNumber: {
    type: String,
    trim: true
  },
  nAmount: {
    type: Number
  },
  oPassportImageInfo: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oSignature1Info: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oSignature2Info: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oDocument1Info: {type: oSchema.Types.ObjectId, ref: 'Image'},
  oDocument2Info: {type: oSchema.Types.ObjectId, ref: 'Image'}
});
oBankAccountSchema.plugin(oAutoIncrement, { inc_field: 'nAccountId', inc_amount: 2, start_seq: 100 });

module.exports = oMongoose.model("Bankaccount", oBankAccountSchema);