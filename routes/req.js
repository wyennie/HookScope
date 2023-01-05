const express = require("express");
const router = express.Router();
const psql = require('../db/psql.js');
const mongo = require('../db/mongo')

router.all('/:pathkey', async (req, res) => {
  // store request in mongo and get mongoID
  let mongoID = await mongo.createRequest(req);
  // associate mongo request with request in postgres
  await psql.saveRequest(req.params.pathkey, mongoID.toString()); 
  res.send('request saved');
});

module.exports = router;
