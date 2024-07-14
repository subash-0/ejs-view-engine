const bcrypt = require("bcrypt");

const hashPassword = async (password) =>{
    let salt = await bcrypt.genSalt(10);
    let enciptedPassword = await bcrypt.hash(password,salt);
    return enciptedPassword;

}

const verifyPassword = async (raw,hash) =>{
    return await bcrypt.compare(raw,hash);

}


module.exports = {hashPassword,verifyPassword};