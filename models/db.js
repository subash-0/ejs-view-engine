const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogpost")
.then(()=>{
    console.log('connection success')
})
.catch((err)=>{
    console.log('error while connecting',err);
})