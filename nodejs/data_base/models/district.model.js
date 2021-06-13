const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oDistrictSchema = new oSchema( { 
  nStateId : {type: Number},
  nDistrictId : {type: Number},
  sDistrictName : {
    type: String,
    trim:true},
    nDistrictCode : {
    type: Number}
});
oDistrictSchema.plugin(oAutoIncrement, {inc_field: 'nDistrictId',start_seq:100});
oDistrictSchema.plugin(oAutoIncrement, {inc_field: 'nDistrictCode',start_seq:1});

module.exports = oMongoose.model("District", oDistrictSchema);