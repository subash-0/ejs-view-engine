const jwt = require("jsonwebtoken");

const verifyUser =(req,res,next)=>{
    if(req.cookies.token==="") return res.redirect("/login");
    let data = jwt.verify(req.cookies.token,'Subash2312@!');
    req.user = data;
    next();
}

module.exports = verifyUser;