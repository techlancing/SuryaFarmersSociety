const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oTransactionSchema = new oSchema({
  nTransactionId : {type: Number},
  sAccountNo: { 
    type: String,
    trim: true
   },
  nLoanId : {type: Number},
  nCreditAmount:{
    type: Number
   },
  nDebitAmount:{
    type: Number
   },
  nBalanceAmount:{
    type: Number
   },
  sDate: {
    type: String,
    trim: true
  },
  sNarration: {
    type: String,
    trim: true
  }
});
oTransactionSchema.plugin(oAutoIncrement, { inc_field: 'nTransactionId', inc_amount: 1, start_seq: 200000 });

module.exports = oMongoose.model("Transaction", oTransactionSchema);