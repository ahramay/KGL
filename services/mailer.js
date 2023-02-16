const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL, // generated ethereal user
    pass: process.env.pass, // generated ethereal password
  },

  tls: {
    rejectUnauthorized: false,
  },
});

let resetPasswordEmail = async ({ to, link }) => {
  console.log(to, link);
  await transporter.sendMail({
    from: 'LoinsPride 👻" <noreply@LoinsPride.com>',
    to,
    subject: "Reset Password",
    html: `<h3>Welcome to LoinsPride</h3><h4>copy the code to reset password</h4><hr><p>Your Verification link is <h1>${link}</h1></p>`,
  });
};

const SendUsMessage = async (value) => {
  // let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@klg.com", // sender address
    from: value.email,
    to: "nawayla7@gmail.com",
    subject: "Send Us a Message", // Subject line
    text: "Welcome to LionsPride", // plain text body
    template: "",
    context: {
      layout: "email",
      heading: "Welcome to LionsPride",
    },
    html: `<h3> LionsPride User Message</h3><h4>
    Email:${value.email}<br>
    Name:${value.name}<br>
    Address:${value.address}<br>
    Phone:${value.phone}<br>
    </h4><hr>
    <p>message:${value.message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const subscribedEmail = async (value) => {
  // let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@klg.com", // sender address
    from: value.email,
    to: "nawayla7@gmail.com",
    subject: "Welcome to LionsPride", // Subject line
    text: "Welcome to LionsPride", // plain text body
    template: "",
    context: {
      layout: "email",
      heading: "Your account is Subscribe",
    },
    html: `<h3>Your account is Subscribe</h3><br>
    Email:${value.email}<br>`,
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
module.exports = { resetPasswordEmail, SendUsMessage, subscribedEmail };
