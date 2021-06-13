const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oMandalSchema = new oSchema( { 
  nDistrictId : {type: Number},
  nMandalId : {type: Number},
  sMandalName : {
    type: String,
    trim:true},
    nMandalCode : {
    type: Number}
});
oMandalSchema.plugin(oAutoIncrement, {inc_field: 'nMandalId',start_seq:200});
oMandalSchema.plugin(oAutoIncrement, {inc_field: 'nMandalCode',start_seq:1});

module.exports = oMongoose.model("Mandal", oMandalSchema);