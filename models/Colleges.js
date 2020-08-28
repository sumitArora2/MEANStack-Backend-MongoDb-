const mongoose = require('mongoose');

const collegeSchema = mongoose.Schema({
  college_name: {
    type: String,
    require: true
  }
},
  {
    timestamps: true
  });


const College = mongoose.model('College', collegeSchema);
module.exports = College;