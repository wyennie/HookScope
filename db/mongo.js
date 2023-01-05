var ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'requestbin';
let db;
let collection;

MongoClient.connect(url, { useNewUrlParser: true }, async (err, client) => {
  if (err) {
    console.log(err);
  } else {
    db = client.db(dbName);
    collection = db.collection('requests');
    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database: ${dbName}`);
  }
});

const createRequest = async (req) => {
  let doc = {
    headers: req.headers,
    body: req.body,
    method: req.method,
  }

  let r = await collection.insertOne(doc);
  
  return r.insertedId;
};

const getRequest = async (id) => {
  // get all requests for given bin ids | return all the mongo docs
  return await collection.findOne({ _id: ObjectId(id) });
};

const deleteRequest = async (mongoID) => {
  await collection.deleteOne({ _id: ObjectId(mongoID) });
};

module.exports = {
  createRequest,
  getRequest,
  deleteRequest
};
