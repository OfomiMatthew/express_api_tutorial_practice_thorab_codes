const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

function mw(req, res, next) {
  if (req.params.id < 10) {
    res.send("You cannot access the file");
  } else {
    next();
  }
}
app.use(mw);

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

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is mandatory"],
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
   
    },

    category: {
      type: String,
      enum: ["Clothing", "Electronics", "Household"],
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

app.post("/products", (req, res) => {
  console.log(req.body)
  productModel.create(req.body)
  res.send({message:"Data created"})
});

app.listen(9000, () => {
  console.log("server running");
});
