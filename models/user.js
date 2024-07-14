const mongoose = require('mongoose');
require('./db');
let userSchema = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'post'

        }
    ]
});


module.exports = mongoose.model('user',userSchema);