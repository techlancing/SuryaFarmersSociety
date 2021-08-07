const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oDailyDepositSchema = new oSchema({
  nDailyDepositId : {type: Number},
  sAccountNo: { 
    type: String,
    trim: true
   },//unique: true},
   nAccountId: {
    type: Number
   },
  sTransactionId: { 
    type: String,
    trim: true,
   },//unique: true},c
   nDayAmount:{
    type: Number
   },
   nAmount:{
    type: Number
   },
   sReceiverName: {
    type: String,
    trim: true
  },
  sStartDate: {
    type: String,
    trim: true
  },
  sEndDate: {
    type: String,
    trim: true
  },
  nTotaldays:{
    type: Number
   },
  sNarration: {
    type: String,
    trim: true
  },
  oTransactionInfo: {type: oSchema.Types.ObjectId, ref: 'Transaction'}

});
oDailyDepositSchema.plugin(oAutoIncrement, { inc_field: 'nDailyDepositId', inc_amount: 1, start_seq: 700000 });

module.exports = oMongoose.model("DailyDeposit", oDailyDepositSchema);