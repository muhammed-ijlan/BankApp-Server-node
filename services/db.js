// database connection//
const mongoose = require("mongoose");

//connection String//
mongoose.connect("mongodb://localhost:27017/BankServer", {
  useNewUrlParser: true,
});

//defineModal//
const User = mongoose.model("User", {
  acno: Number,
  uname: String,
  password: String,
  balance: Number,
  transaction: [],
});

module.exports = {
  User,
};
