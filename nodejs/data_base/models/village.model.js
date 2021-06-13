const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oVillageSchema = new oSchema( { 
  nMandalId : {type: Number},
  nVillageId : {type: Number},
  sVillageName : {
    type: String,
    trim:true},
    nVillageCode : {
    type: Number}
});
oVillageSchema.plugin(oAutoIncrement, {inc_field: 'nVillageId',start_seq:500});
oVillageSchema.plugin(oAutoIncrement, {inc_field: 'nVillageCode',start_seq:1});

module.exports = oMongoose.model("Village", oVillageSchema);