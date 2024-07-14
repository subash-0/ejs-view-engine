const express = require("express");
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const {hashPassword, verifyPassword}= require("./handler/passwordHandler");
const path = require('path');
const jwt = require('jsonwebtoken');
const verifyUser = require("./handler/loggedInHandler");
const app = express();
const PORT = 5000;
const jwtSecret = 'Subash2312@!'
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));



app.get("/",(req,res)=>{
    res.render('index');
})
app.post("/register", async(req,res)=>{
    let {email,password,username,name} = req.body;
    let user = await userModel.findOne({email});
    if(user) return res.send("user with email already exist !");
    user = await userModel.create({
        name,
        username,
        email,
        password: await hashPassword(password),
    });
   let token =  jwt.sign({email:user.email, userId: user._id},jwtSecret);
   res.cookie('token',token);
   res.redirect("/login");
});

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async(req,res)=>{
    let {email,password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.send("Email or password is Wrong !");
    let verify = await verifyPassword(password,user.password);
    if(verify) {
        let token =  jwt.sign({email:user.email, userId: user._id},jwtSecret);
         res.cookie('token',token);
         res.redirect("/profile");
    }
    else return res.send("Email or password is Wrong !");

  
});app.post("/login", async(req,res)=>{
    let {email,password} = req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.send("Email or password is Wrong !");
    let verify = await verifyPassword(password,user.password);
    if(verify) {
        let token =  jwt.sign({email:user.email, userId: user._id},jwtSecret);
         res.cookie('token',token);
         res.redirect("/profile");
    }
    else return res.send("Email or password is Wrong !");

  
});

app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
})

app.get("/profile",verifyUser, async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate("posts");
    res.render("profile",{user});

});
app.post("/post",verifyUser, async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
   let {title,content} = req.body;
    let post = await postModel.create({
        user:user._id,
        title,
        content,

    })

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
})
app.get("/like/:id",verifyUser ,async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id}).populate('user');
    if(post.likes.indexOf(req.user.userId)===-1){
        post.likes.push(req.user.userId);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userId),1); 
    }
    await post.save();
    res.redirect("/profile")
    

});
app.get("/close", async (req,res)=>{
    res.redirect("/profile")
})

app.get("/edit/:id", async (req,res)=>{
    let post = await postModel.findOne({_id:req.params.id});
    res.render("edit",{post})
});
app.post("/update/:id", async (req,res)=>{
    let {title,content} = req.body;
    await postModel.findOneAndUpdate({_id:req.params.id},{title,content});
    res.redirect("/profile");
})

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})