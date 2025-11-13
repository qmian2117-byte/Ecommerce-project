const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "qmian2117@gmail.com",   // your Gmail
    pass: "lmkvgxkvluynrfda",   // 16-digit App Password
  },
});

const handlebarOptions = {
  viewEngine: {
    extname: ".handlebars",
    partialsDir: path.resolve("./view/"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./view/"),
  extname: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

let sendemail = async (email, subject, name, params) => {
  try {
    let currentDatetime = new Date().toLocaleString();
    const info = await transporter.sendMail({
      from: '"Amely Test" <qmian2118@gmail.com>', // ✅ must match Gmail
      to: email, // e.g., "qmian2117@gmail.com"
      subject: subject,
      template: "email", // loads view/email.handlebars
      context: {
        name: name,
        message: "Welcome to our service! We are glad to have you.",
        date: currentDatetime,
        params: params,
        userName: name,
      },
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

module.exports = sendemail;
