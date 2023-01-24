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

const SendUsMessage = async (playload) => {
  // let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@klg.com", // sender address
    from: playload.email,
    to: "alibaloch405060@gmail.com",
    subject: "Send Us a Message", // Subject line
    text: "Welcome to LionsPride", // plain text body
    template: "",
    context: {
      layout: "email",
      heading: "Welcome to LionsPride",
      ...playload,
      // logoImage,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendVerificationEmail = async ({ to, verificationCode, logoImage }) => {
  let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@LionsPride.com", // sender address
    to,
    subject: "Account Verification Email", // Subject line
    text: "Welcome to LionsPride", // plain text body
    template: "email/verify_account",
    context: {
      layout: "email",
      verificationCode,
      heading: "Welcome to LionsPride",
      logoImage,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};
module.exports = { resetPasswordEmail, SendUsMessage };

// const makeTransporter = ({
//   user = "admin@out-class.org",
//   pass = "synigbxlippylbxk",} = {}) => {
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user, // generated ethereal user
//       pass, // generated ethereal password
//     },
//   });
// const transporter=nodemailer.createTransport({
//   host:"smtp.gmail.com",
//   port:465,
//   secure:true,//true for 465 ,false for other ports
//   auth:{
//     user:process.env.
//   }
// })
//   transporter.use("compile", mailerHbs(hbsOptions));
//   return transporter;
// };
