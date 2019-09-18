const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const bcrypt = require('bcrypt');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255
    }
  }
);

const User = mongoose.model("User", UserSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  };
  return Joi.validate(user, schema);
}

function validPassword(password,  hash, callback) {
  bcrypt.compare(password, hash, function(err, res) {
    callback(err, res);
  });
}

exports.User = User;
exports.validate = validateUser;
exports.validPassword = validPassword;
