const Data = require('./data');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const NameRatingSchema = new Schema (
  {
    babyname: Data.schema,
    rating: Number,
    ratingFromShare: Number
  }
);
const SharedSchema = new Schema (
  {
    user: ObjectId,
    status: Number // 0 - pending, 1 - accepted
  }
);
const OwnerSchema = new Schema (
  {
    id: ObjectId,
    name: String
  }
);
const ShortlistSchema = new Schema (
  {
    name: String,
    //isShared: Boolean,
    list: [NameRatingSchema],
    owner: OwnerSchema
    sharedWith: SharedSchema
  }
);

module.exports = mongoose.model("Shortlist", ShortlistSchema,'shortlists');
