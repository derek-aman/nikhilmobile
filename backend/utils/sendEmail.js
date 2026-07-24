import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

export const sendEmail = async ({ to, subject, text }) => {
  if (!to) return;
  try {
    await getTransporter().sendMail({
      from: `"FixIt Mobile" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};