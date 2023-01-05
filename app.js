require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const apiRouter = require('./routes/api');
const reqRouter = require('./routes/req')

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use('/bins', apiRouter);
app.use('/req', reqRouter);
app.listen(process.env.PORT, () => {console.log(`Request bin application listening on port ${process.env.PORT}`)});
