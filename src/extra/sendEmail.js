const nodemailer = require("nodemailer");
const sendEmail = async (otp, email) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "demoproject2608@gmail.com",
      pass: "7433985751",
    },
  });

  try {
    
  let info = await transporter.sendMail({
    from: "demoproject2608@gmail.com",
    // to: email,
    to: "keval.180410107122@gmail.com",
    subject: "Please confirm your Email account",
    html: "<h1>" + otp + "</h1>",
  });

  } catch (error) {
    throw new Error(error.message)
  }
};
module.exports = sendEmail;
