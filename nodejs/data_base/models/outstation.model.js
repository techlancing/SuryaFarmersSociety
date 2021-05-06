const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oOutstationSchema = new oSchema( { 
  nOutstationId : {type: Number},//unique: true},
  sOutstationFrom : {
    type: String,
    trim:true},
    sOutstationFromDate : {
      type: String,
      trim:true},
  sOutstationTo : {
    type: String,
    trim:true},
    sOutstationToDate : {
      type: String,
      trim:true},
  sOutstationDistance : {
    type: Number},
  sOutstationTripType : {
    type: Number}
});
oOutstationSchema.plugin(oAutoIncrement, {inc_field: 'nOutstationId',start_seq:200000});

module.exports = oMongoose.model("Outstation", oOutstationSchema);