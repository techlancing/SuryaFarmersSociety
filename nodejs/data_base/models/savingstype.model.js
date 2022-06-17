const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oSavingsTypeSchema = new oSchema({
  nSavingsId : {type: Number},
  sAccountNo: { 
    type: String,
    trim: true
   },//unique: true},
   nDepositAmount:{
    type: Number
   },
   nIntrest : {
      type : Number
    },
    nSavingDays : {
      type : Number
    },
    nSavingMonths : {
      type : Number
    },
  nMaturityAmount : {
      type : Number
    },
  sMonthInterestAddDate: {
    type: String,
    trim: true
  },
  sTransactionId: {
    type: String,
    trim: true
  },
  sStartDate: {
    type: String,
    trim: true
  },
  sMaturityDate: {
    type: String,
    trim: true
  },
  sRepaymentDate: {
    type: String,
    trim: true
  },
  sTypeofSavings: {
    type: String,
    trim: true
  },
  sPensionInterestAddDate: {
    type: String,
    trim: true
  },
  nSavingTotalYears: {
    type: Number
  },
  nSavingTotalDays:{
    type: Number
  },
  nPensionAmountMonths: {
    type: Number
  },
  nPensionInterestAddAmount:{
    type : Number
  },
  sPensionDepositInterestOnAccount:{
    type : String,
    trim: true
  },
  sEmployeeName: {
    type: String,
    trim: true
  },
  sIsApproved: {
    type: String,
    trim: true
  },
  sStatus: {
    type : String,
    trim : true
  },
  oTransactionInfo: [{type: oSchema.Types.ObjectId, ref: 'Transaction'}]
});
oSavingsTypeSchema.plugin(oAutoIncrement, { inc_field: 'nSavingsId', inc_amount: 1, start_seq: 850000 });

module.exports = oMongoose.model("SavingsType", oSavingsTypeSchema);