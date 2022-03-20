// Predefined Services
const express = require('express');
const mongoose = require('mongoose');
const router = require('./src/routes/index');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const app = express();

app.use(express.json());
// Connect to MongoDb Atlas
const connect = mongoose.connect(process.env.MONGO_CONNECTION_STRING);
connect.then(
  () => {
    console.log('Connect to the Server Correctly...');
    // Start Serve if you connect to DB Correctly
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
    // Use Router Middle
    app.use(router);
  },
  (err) => {
    console.log(err);
  }
);
