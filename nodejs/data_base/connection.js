const oMongoose = require('mongoose');

//const sDbUrl = 'mongodb://localhost:27017/deemporium';
//sDbUrl = "mongodb+srv://raghuram:adaptnext@cluster0.vpew3.mongodb.net/gully2delhi?retryWrites=true&w=majority";
// For VPS mongodb
//sDbUrl = 'mongodb://adaptnext:AdaptNext%232020@localhost:27017/gully2delhi?authSource=admin';

//let sDbUrl = process.env.CLUSTER_DB_PATH;
if (process.env.IS_PRODUCTION === "YES")
  sDbUrl = process.env.VPS_DB_PATH;
const sDbUrl = process.env.LOCALHOST_DB_PATH;
//const sDbUrl = process.env.VPS_DB_PATH;

oMongoose.connect(sDbUrl, { useFindAndModify: false, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }, (oError) => {
  if (!oError) {
    console.log("DB connected successfully");
  }
  else {
    console.log("Failed to connect to DB." + oError);
  }
});