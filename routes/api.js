const express = require("express");
const router = express.Router();
const psql = require('../db/psql.js');
const mongo = require('../db/mongo')

function generatepathkey() {
  let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';

  for (let n = 1; n <= 5; n++) {
    key += characters[parseInt(Math.random() * 36, 10)];
  }

  return key;
}

async function pathkeyExists(key) {
  let check = await psql.getBin(key);
  return check.length > 0;
}

async function getUniquepathkey() {
  let candidate;

  do {
    candidate = generatepathkey();
  } while (await pathkeyExists(candidate))

  return candidate;
}

// bin creation
router.post('/new', async (req, res) => {
  let pathkey = await getUniquepathkey();

  try {
    await psql.makeBin(pathkey);
    res.status(200).json(pathkey);
  } catch (error) {
    console.log(error);
    res.status(404).end();
  }
});

// gets all requests for bin
router.get('/:pathkey', async (req, res) => {
  try {
    let mongoIds = await psql.getAllRequests(req.params.pathkey);
    let mongoDocs = [];

    for (const request of mongoIds) {
      let doc = await mongo.getRequest(request.mongoid);
      mongoDocs.push(doc);
    }

    res.send(mongoDocs);
  } catch (error) {
    console.log(error);
    res.status(404).end();
  }
});

// delete bin
router.delete('/:pathkey', async (req, res) => {
  let pathkey = req.params.pathkey;
  let mongoIds = await psql.getAllRequests(req.params.pathkey);

  for (const request of mongoIds) {
    await mongo.deleteRequest(request.mongoid);
  }

  try {
    await psql.deleteBin(pathkey);
    res.send('successful')
  } catch (error) {
    console.log(error);
    res.status(404).end();
  }
});

module.exports = router;
