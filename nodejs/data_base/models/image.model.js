const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oImageSchema = new oSchema( { 
  nImageId : {type: Number},//unique: true},
  sImageName : {
    type: String,
    trim:true},
  sImageURL : {
    type: String,
    trim:true},
  sImageType : {type: String}
});
oImageSchema.plugin(oAutoIncrement, {inc_field: 'nImageId',start_seq:600000});

module.exports = oMongoose.model("Image", oImageSchema);