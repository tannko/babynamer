const Babyname = require('./babyname');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const EditorSchema = new Schema (
  {
    id: ObjectId,
    name: String, // user name
    list: {
      type: Map,
      of: Number
    },
    isUpdated: Boolean
  }
);
const ShortlistSchema = new Schema (
  {
    name: String, // list name
    status: Number, // 0 - not shared, 1 - pending, 2 - accepted
    owner: EditorSchema,
    partner: EditorSchema
  }
);

module.exports = mongoose.model("Shortlist", ShortlistSchema,'shortlists');
