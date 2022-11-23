const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oIntraTransactionSchema = new oSchema({
  nIntraTransactionId : {type: Number},
  sSenderAccountNumber: { 
    type: String,
    trim: true,
   },//unique: true},
   sRecieverAccountNumber: { 
    type: String,
    trim: true,
   },//unique: true},
   sSenderAccountType: { 
    type: String,
    trim: true,
   },
   sRecieverAccountType: { 
    type: String,
    trim: true,
   },
   sTransactionEmployee: {
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
  },
  nAmount: {
    type: Number
  },
  senderTransaction: {
    type: oSchema.Types.ObjectId, ref: 'Transaction'
  },
  recieverTransaction: {
    type: oSchema.Types.ObjectId, ref: 'Transaction'
  }
 
});
oIntraTransactionSchema.plugin(oAutoIncrement, { inc_field: 'nIntraTransactionId', inc_amount: 1, start_seq: 500000 });


module.exports = oMongoose.model("IntraTransaction", oIntraTransactionSchema);