const mongoose = require("mongoose");

const { Schema } = mongoose;

const members = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  palette: [{ name: { type: String }, colors: [{ type: String }] }],
});
const Members = mongoose.model("_Members", members);

module.exports = Members;
