const express = require('express');
const router = express.Router();
// import Call Model
const callModel = require('../models/calls');
// Import Twilio Library to Receive InBound Calls
const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });
// Configure Client using Twilio Account SID and Twilio Auth Token
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// Route to Handle Incoming Calls
router.post('/call', async (req, res) => {
  const digitsProvided = req.body.Digits;
  if (digitsProvided == '1') {
    await callModel.create({
      type: 'forwading',
    });
    const response = new twilio.twiml.VoiceResponse();
    response.say('Your call has been redirected to my personal number');
    response.dial(process.env.PHONE_NUMBER);
    res.type('text/xml');
    res.send(response.toString());
  } else if (digitsProvided == '2') {
    const twiml = new twilio.twiml.VoiceResponse();
    await callModel.create({
      type: 'recording',
    });
    twiml.say(
      { voice: 'alice', language: 'en-GB' },
      'Please leave a message after the beep'
    );
    twiml.record();
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});
// Route to get All Calls Details
router.get('/allcalls', async (req, res) => {
  try {
    const calls = await client.calls.list();
    const responseArray = [];
    for (const call of calls) {
      let tempObj = {};
      tempObj['sid'] = call.sid;
      tempObj['to'] = call.to;
      tempObj['from'] = call.from;
      tempObj['status'] = call.status;
      tempObj['duration'] = call.duration;
      responseArray.push(tempObj);
      tempObj = {};
    }
    res.status(200).json(responseArray);
  } catch (error) {
    console.log('Error', error);
  }
});
// Test Route
router.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
