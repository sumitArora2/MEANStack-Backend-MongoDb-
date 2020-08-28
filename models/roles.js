const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
  role_name: {
    type: String,
    require: true
  }
},
  {
    timestamps: true
  })


const Role = mongoose.model('Role', roleSchema);
module.exports = Role;