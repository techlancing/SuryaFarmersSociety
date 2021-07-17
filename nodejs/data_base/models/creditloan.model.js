const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oCreditLoanSchema = new oSchema({
  nLoanId : {type: Number},
  sAccountNo: { 
    type: String,
    trim: true
   },//unique: true},
   nSanctionAmount:{
    type: Number
   },
   sTransactionId: {
    type: String,
    trim: true
  },
  sDate: {
    type: String,
    trim: true
  },
  sTypeofLoan: {
    type: String,
    trim: true
  },
  sInstallmentType: {
    type: String,
    trim: true
  },
  sLoanRepaymentPeriod: {
    type: String,
    trim: true
  },
  nInstallmentAmount:{
    type: Number
  },
  sEndofLoanDate: {
    type: String,
    trim: true
  },
  nLetPenaltyPercentage:{
    type: Number
  },
  sEmployeeName: {
    type: String,
    trim: true
  },
});
oCreditLoanSchema.plugin(oAutoIncrement, { inc_field: 'nLoanId', inc_amount: 1, start_seq: 100000 });

module.exports = oMongoose.model("CreditLoan", oCreditLoanSchema);