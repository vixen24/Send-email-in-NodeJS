const mongoose = require('mongoose')
const AccountSchema = new mongoose.Schema({
    first_name:{
        type: String,
    },
    email_address:{
        type: String,    
    },
    password:{
        type: String,   
    },
    tracking_time:{
        type: Date,    
    },
    login_time:{
        type: Date,  
    },
    sent_time: {
        type: Date,
    }
});
const Account = mongoose.model("Account", AccountSchema)
module.exports = Account;