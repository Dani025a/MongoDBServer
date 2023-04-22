const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    userName: { type: String, unique: true },
    fullName: String,
    phoneNumber: { type: String, unique: true },
    password: String,
    userType: String
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", UserDetailsScehma);