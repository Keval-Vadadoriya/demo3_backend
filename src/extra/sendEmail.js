const nodemailer = require("nodemailer");
const sendEmail = async (otp) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "demoproject2608@gmail.com",
      pass: "7433985751",
    },
  });

  let info = await transporter.sendMail({
    from: "demoproject2608@gmail.com",
    // to: email,
    to: "keval.180410107122@gmail.com",
    subject: "Please confirm your Email account",
    text: "Hello world?",
    html: "<h1>" + otp + "</h1>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
module.exports = sendEmail;
