const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oDebitSchema = new oSchema({
  nDebitId : {type: Number},
  sTransactionId: { 
    type: String,
    trim: true,
   },//unique: true},
   nAmount:{
    type: Number
   },
   sReceiverName: {
    type: String,
    trim: true
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
oDebitSchema.plugin(oAutoIncrement, { inc_field: 'nDebitId', inc_amount: 1, start_seq: 300000 });

module.exports = oMongoose.model("Debit", oDebitSchema);