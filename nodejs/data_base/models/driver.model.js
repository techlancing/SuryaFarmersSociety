const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oDriverSchema = new oSchema( { 
  nDriverId : {type: Number},//unique: true},
  sDriverName : {
    type: String,
    trim:true},
  sDriverMobile : {
    type: Number
  },
  sDriverAddress : {
    type: String,
    trim:true},
  sDriverExperience : {
    type: Number},
    sDriverAge : {
      type: Number},
    sDriverLicense:{
      type: Number
    },
    oImageInfo: {type: oSchema.Types.ObjectId, ref: 'Image'}
});
oDriverSchema.plugin(oAutoIncrement, {inc_field: 'nDriverId',start_seq:200000});

module.exports = oMongoose.model("Driver", oDriverSchema);