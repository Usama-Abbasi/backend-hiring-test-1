const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Call = new Schema({
  type: {
    type: String,
    default: '',
  },
  
});
module.exports = mongoose.model('Call', Call);
