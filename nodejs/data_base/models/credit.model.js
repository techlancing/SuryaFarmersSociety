const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oCreditSchema = new oSchema({
  nCreditId : {type: Number},
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
oCreditSchema.plugin(oAutoIncrement, { inc_field: 'nCreditId', inc_amount: 1, start_seq: 200000 });

module.exports = oMongoose.model("Credit", oCreditSchema);