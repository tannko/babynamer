const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TO DO
// change the name to the proper one
const BabynameSchema = new Schema(
  {
    gender: {type: String},
    name: {type: String},
    meaning: {type: String}
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Babyname", BabynameSchema, 'baby_names');
