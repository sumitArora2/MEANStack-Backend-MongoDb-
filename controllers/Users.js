const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken');
var bcrypt = require("bcryptjs");
const User = require('../models/User')
const passport = require('passport');
var config = require('../config/db');
const role = require('../models/roles');
users.use(cors())

process.env.SECRET_KEY = 'secret'

module.exports = {
  profile: async (req, res) => {
    try {
      var decoded = passport.authenticate(req.headers['authorization'], config.secret)

      let newUser = await User.findOne({
        id: decoded.id
      })
      if (newUser) {
        res.json(newUser)
      } else {
        res.send('User does not exist')
      }
    }
    catch (err) {
      res.send(err);
    }
  },
  register: async (req, res) => {
    try {
      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        college_name: req.body.college_name,
        role: req.body.role_name
      });
      User.addUser(newUser, (err, user) => {
        if (err) {
          let message = "";
          // if (err.errors.username) message = "Username is already taken. ";
          if (err.errors.email) message += "Email already exists.";
          return res.json({
            success: false,
            message: message
          });
        } else {
          return res.json({
            success: true,
            message: "User registration is successful."
          });
        }
      });
    }
    catch (err) {
      res.send(err);
    }
  },
  login: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const college_name = req.body.college_name;
      const role = req.body.role_name;
      User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        if (!user) {
          return res.json({
            success: false,
            message: "User not found."
          });
        }
        if (user.college_name != college_name) {
          return res.json({
            success: false,
            message: "Wrong College Name selected!"
          });
        }
        if (user.role != role) {
          return res.json({
            success: false,
            message: "You are not authorised to login with this role"
          });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            const token = jwt.sign({
              type: "user",
              data: {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                college_name: user.college_name,
                role: user.role
              }
            }, config.secret, {
              expiresIn: 604800 // for 1 week time in milliseconds
            });
            return res.json({
              success: true,
              token: "JWT " + token
            });
          } else {
            return res.json({
              success: false,
              message: "Wrong Password."
            });
          }
        });
      });
    } catch (err) {
      res.send(err);
    }
  },
  updateProfile: async (req, res) => {
    try {
      let id = req.params.id;
      let user = await User.findByIdAndUpdate({
        _id: id,
      }, {
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        college_name: req.body.college_name
      });
      return res.status(200).send({ message: "Profile Updated Successfully." })
    }
    catch (err) {
      return res.send(err);
    }
  },
  deleteProfile: async (req, res) => {
    try {
      let user = await User.findByIdAndDelete({
        _id: req.body.id,
      });
      return res.status(200).send({ message: "Profile Delete Successfully" })
    }
    catch (err) {
      return res.send(err);
    }
  },
  addRole: async (req, res) => {
    try {
      let newRole = {
        role_name: req.body.role_name
      }
      let result = await role.create(newRole);
      return res.status(200).send({ message: "role added Successfully" })
    } catch (error) {
      return res.send(err);
    }
  },
  getRole: async (req, res) => {
    try {
      let result = await role.find({});
      return res.status(200).send(result);
    } catch (error) {
      return res.send(err);
    }
  }
}