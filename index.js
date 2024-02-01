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

// get all data

app.get("/products", (req, res) => {
  productModel
    .find()
    .then((products) => {
      res.send(products);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// get one product

app.get("/products/:id", (req, res) => {
  productModel
    .findOne({ _id: req.params.id })
    .then((product) => {
      res.send(product);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// Create (Post request)
app.post("/products", (req, res) => {
  productModel
    .create(req.body)
    .then((document) => {
      res.send({ data: document, message: "Product created" });
    })
    .catch((err) => {
      console.log(err);
      res.send({ message: "Issue occured while creating data" });
    });
});

//  delete post
app.delete("/products/:id", (req, res) => {
  productModel
    .deleteOne({ _id: req.params.id })
    .then(() => {
      res.send({message:"product deleted"});
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// update operation

app.put('/products/:id',(req,res)=>{
  productModel
    .updateOne({ _id: req.params.id },req.body)
    .then(() => {
      res.send({message:"product updated"});
    })
    .catch((err) => {
      console.log(err.message);
    });
})

app.listen(9000, () => {
  console.log("server running");
});
