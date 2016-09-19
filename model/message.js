var mongoose = require('mongoose');  
var messageSchema = new mongoose.Schema({
  email: String,
  text: String,
  dob: { type: Date, default: Date.now },
});
mongoose.model('Message', messageSchema);