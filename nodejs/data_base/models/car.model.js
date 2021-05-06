const oMongoose = require('mongoose');
const oAutoIncrement = require('mongoose-sequence')(oMongoose);

const oSchema = oMongoose.Schema

var oCarSchema = new oSchema({
  nCarId: { type: Number },//unique: true},
  sCarName: {
    type: String,
    trim: true
  },
  sCarType: {
    type: String,
    trim: true
  },
  sCarSeating: {
    type: String,
    trim: true
  },
  sCarRent: {
    type: Number
  },
  sCarDistanceCost: {
    type: Number
  },
  sCarTimeCost: {
    type: Number
  },
  oImageInfo: {type: oSchema.Types.ObjectId, ref: 'Image'}
});
oCarSchema.plugin(oAutoIncrement, { inc_field: 'nCarId', start_seq: 100 });

module.exports = oMongoose.model("Car", oCarSchema);