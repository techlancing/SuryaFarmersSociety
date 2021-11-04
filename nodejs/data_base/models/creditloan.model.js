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
    nIntrest : {
      type : Number
    },
    nTotalAmount : {
      type : Number
    },
   sTransactionId: {
    type: String,
    trim: true
  },
  sLoanStatus: {
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
  nLoanRepaymentPeriod: {
    type: Number
  },
  nInstallmentAmount:{
    type: Number
  },
  sEndofLoanDate: {
    type: String,
    trim: true
  },
  nLoanDays:{
    type : Number
  },
  nLoanMonths:{
    type : Number
  },
  nLetPenaltyPercentage:{
    type: Number
  },
  sEmployeeName: {
    type: String,
    trim: true
  },
  oTransactionInfo: [{type: oSchema.Types.ObjectId, ref: 'Transaction'}]
});
oCreditLoanSchema.plugin(oAutoIncrement, { inc_field: 'nLoanId', inc_amount: 1, start_seq: 100000 });

module.exports = oMongoose.model("CreditLoan", oCreditLoanSchema);