const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const app = express();

app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://ofomimatthew7:jerryhope1994@cluster0.e4jquae.mongodb.net/thorabcodes_api_dev_demo"
  )
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// user schema

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is mandatory"],
    },

    email: {
      type: String,
      required: [true, "Email is mandatory"],
    },

    password: {
      type: String,
      required: [true, "Password is mandatory"],
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

// register user endpoint
app.post("/register/", (req, res) => {
  let user = req.body;

  bcryptjs.genSalt(10, (err, salt) => {
    if (!err) {
      bcryptjs.hash(user.password, salt, (err, hash) => {
        if (!err) {
          user.password = hash;
          userModel
            .create(user)
            .then(() => {
              res.send({ message: "User registration successful!" });
            })
            .catch((err) => {
              res.send(err.message);
            });

          console.log(hash);
        }
      });
    }
  });
});


// login endpoint
app.post("/login/", (req, res) => {
  let userCred = req.body;

  userModel
    .findOne({ email: userCred.email })
    .then((user) => {
      if (user !== null) {
        bcryptjs.compare(userCred.password, user.password, (err, result) => {
          if (result === true) {
            res.send({ message: "login success" });
          } else {
            res.send({ message: "Incorrect password" });
          }
        });
      } else {
        res.send("wrong user email");
      }
      console.log(user);
    })
    .catch((err) => {
      res.send(err.message);
    });
});



app.listen(9000, () => {
  console.log("server running");
});
