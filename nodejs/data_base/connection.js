const oMongoose = require('mongoose');

//const sDbUrl = 'mongodb://localhost:27017/deemporium';
//sDbUrl = "mongodb+srv://raghuram:adaptnext@cluster0.vpew3.mongodb.net/gully2delhi?retryWrites=true&w=majority";
// For VPS mongodb
//sDbUrl = 'mongodb://adaptnext:AdaptNext%232020@localhost:27017/gully2delhi?authSource=admin';

let sDbUrl = process.env.CLUSTER_DB_PATH;
if (process.env.IS_PRODUCTION === "NO")
  sDbUrl = process.env.VPS_DB_PATH;

sDbUrl = process.env.LOCALHOST_DB_PATH;
//const sDbUrl = process.env.VPS_DB_PATH;

oMongoose.connect(sDbUrl).then(() => {
  console.log('DB connected successfully');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb://localhost:27017";
const dbName = "myDatabase";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB server");
    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}