const express= require("express");
const { default: mongoose, Mongoose } = require("mongoose");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");

const JWT_SECRET = JWT_SECRET;

  const mongoUrl = process.env.MONGO_URL;


  mongoose.connect(mongoUrl,{
    useNewUrlParser:true
}).then(()=>{console.log("Connected to database")}).catch(e=>console.log(e))

app.listen(5000, ()=>{
    console.log("server started!")
})

require("./userDetails");
require("./menuDetails")

const User = mongoose.model("UserInfo");
const MenuItem = mongoose.model("MenuItems");

app.post("/signup", async (req, res) => {
    const { userName, fullName, phoneNumber, password } = req.body;
  
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
      const userNameExist = await User.findOne({ userName });
      const phoneNumberExist = await User.findOne({ phoneNumber });
  
      if (userNameExist) {
        return res.json({ error: "Username exist" });
      }
      if (phoneNumberExist) {
        return res.json({ error: "Phone number exist" });
      }
      await User.create({
        userName,
        fullName,
        phoneNumber,
        password: encryptedPassword,
        userType: "Admin"
      });

      const token = jwt.sign({ userName: userName }, JWT_SECRET, {
        expiresIn: "15m",
      });
  
      if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    }
    } catch (error) {
      res.send({ status: "error" });
    }
  });
  app.post("/login", async (req, res) => {
    const { userName, password } = req.body;
  
    const user = await User.findOne({ userName });
    if (!user) {
      return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userName: user.userName }, JWT_SECRET, {
        expiresIn: "15m",
      });
  
      if (res.status(201)) {
        return res.json({ status: "ok", data: token });
      } else {
        return res.json({ error: "error" });
      }
    }
    res.json({ status: "error", error: "InvAlid Password" });
  });


app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      console.log(token, JWT_SECRET)
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const userName = user.userName;
    User.findOne({ userName: userName })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});



app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteMenuItem", async (req, res) => {
  const { id } = req.body;

  MenuItem.deleteById({ _id: id }, function(err) {
    if (!err) {
            message.type = 'notification!';
    }
    else {
            message.type = 'error';
    }
});
});


app.get("/getAllMenuItems", async (req, res) => {
  try {
    const allItems = await MenuItem.find({});
    res.send({ status: "ok", data: allItems });
  } catch (error) {
    console.log(error);
  }
});