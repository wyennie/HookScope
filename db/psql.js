require('dotenv').config();
const pgp = require('pg-promise')();

const cn = {
  host: process.env.HOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
};

const db = pgp(cn);

console.log('Connected to pSQL');

const getBin = async (pathkey) => {
  let query = "SELECT * FROM bins WHERE path_key = $1;";

  return await db.any(query, pathkey);
}

const getAllRequests = async (pathkey) => {
  const query = `SELECT requests.mongo_id AS mongoId FROM requests LEFT JOIN
  bins ON bins.id = requests.bin_id WHERE bins.path_key = $1;`;
  return await db.any(query, [pathkey]);
}

const deleteBin = async (pathkey) => {
  let query = 'DELETE FROM bins WHERE path_key = $1;';

  return await db.any(query, [pathkey]);
}

const makeBin = async (pathkey) => {
  let query = 'INSERT INTO bins (path_key) VALUES ($1);';

  return await db.any(query, [pathkey]); 
}

const saveRequest = async (pathkey, mongoID) => {
  let bin = (await getBin(pathkey))[0];

  console.log(bin);
  let query = 'INSERT INTO requests (bin_id, mongo_id) VALUES ($1, $2);';

  return await db.any(query, [bin.id, mongoID]);
}

module.exports = { 
  getBin,
  saveRequest,
  getAllRequests,
  deleteBin,
  makeBin
};
