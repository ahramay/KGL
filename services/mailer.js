const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.pass, // generated ethereal password
  },
});

let resetPasswordEmail = async ({ to, link }) => {
  console.log(to, link);
  await transporter.sendMail({
    from: 'KLG 👻" <noreply@bued.com>',
    to: "alibaloch405060@gmail.com",
    subject: "Reset Password",
    html: `<h3>Welcome to KLG</h3><h4>Click the link to reset password</h4><hr><p>Your Verification link is ${link}</p>`,
  });
};

module.exports = { resetPasswordEmail };
