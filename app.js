"use strict";
if(process.env.NODE_ENV !== 'production') { 
  require('dotenv').config() 
}
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Account = require("./models/accountSchema")
const template = require("./template");

//mongoDB setup
// (async () => {
// await mongoose.connect(process.env.dbURI)
// mongoose.connection.on('error', error => console.error(error))
// mongoose.connection.once('open', () => console.log("Connected to MongoDB\n"))
// })();

var count = 0;

async function sendEmail(recipient, firstName, trackerID) {
  
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: true, //use SSL
    auth: {
      user: process.env.USER,
      pass: process.env.PASS, 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.SENDER,
    to: recipient,
    subject: process.env.SUBJECT,
    html: template(firstName, trackerID)
  });

  count =count+1;
  console.log(count, recipient)
}

async function main() {

  await mongoose.connect(process.env.dbURI)
  mongoose.connection.on('error', error => console.error(error))
  mongoose.connection.once('open', () => console.log("Connected to MongoDB\n"))

  let allAccount = await Account.find()
  console.log(allAccount)
  for (let value of allAccount) {
    const trackerID = process.env.baseURL + "/" + value._id;
    await sendEmail(value.email_address, value.first_name, trackerID);

    value.sent_time = new Date().toLocaleString("en-US", {timeZone: "Africa/Lagos"})
    await value.save().catch(error => console.error(error))
   }
   
  mongoose.connection.close()
  .then(()=> {
    console.log('\nMongoDB connection closed')
  });

  console.log("\nSuccessful, the end")

}
//setTimeout(main,3000);
main().catch(console.error);