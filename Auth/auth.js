const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
            jwt.sign({ email: userCred.email }, "mattkey", (err, token) => {
              if (!err) {
                res.send({ token: token });
              } else {
                res.send("issue occured creating token");
              }
            });

            // res.send({ message: "login success" });
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


// endpoint for accessibility i.e to know if you have a token or not

app.get('/getdata/',verifyToken, (req,res)=>{
  res.send({message:"accessible endpoint"})
})

function verifyToken(req,res,next){
let token = req.headers.authorization.split(' ')[1]
jwt.verify(token,"mattkey",(err,data)=>{
  if(!err){
    console.log(data)
    next()
  }else{
    res.send({message:"invalid token please login"})
  }
})

// res.send("coming from middleware")

}

app.listen(9000, () => {
  console.log("server running");
});
