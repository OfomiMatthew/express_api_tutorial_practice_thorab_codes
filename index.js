const express = require("express");
const app = express();


function mw(req,res,next){
  if(req.params.id <10){
    res.send("You cannot access the file")
  }else{
    next()
  }
}
app.use(mw)

app.get('/products',(req,res)=>{
console.log("data gotten")
res.send({message:"data gotten"})
})

app.get('/users/:id',(req,res)=>{
  console.log(req.params.id)
  res.send({message:`data gotten from user`})
})




app.listen(9000,()=>{
  console.log('server running')
})