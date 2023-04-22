const mongoose = require("mongoose");

const MenuDetailssScehma = new mongoose.Schema(
  {
    name: String,
    price: String,
  },
  {
    collection: "MenuItems",
  }
);

mongoose.model("MenuItems", MenuDetailssScehma);