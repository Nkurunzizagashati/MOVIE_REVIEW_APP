import nodemailer from "nodemailer";

const generateOTP = (otp_length = 6) => {
  // GENERATE OTP

  let OTP = "";

  for (let i = 1; i <= otp_length; i++) {
    const random = Math.round(Math.random() * 9);
    OTP += random;
  }

  return OTP;
};

const generateMailTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });
};

export { generateMailTransporter, generateOTP };
