import nodemailer from "nodemailer";


export enum EmailType {
  OTP_VERIFICATION = "OTP_VERIFICATION",
  BOOKING_CONFIRMATION = "BOOKING_CONFIRMATION",
  THANK_YOU = "THANK_YOU",
}

interface SendEmailParams {
  to: string;
  type: EmailType;
  otp?: string;
  expiresAt?: Date;
  eventName?: string;
}

// transporter (reusable)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  to,
  type,
  otp,
  expiresAt,
  eventName,
}: SendEmailParams) => {
  let subject = "";
  let html = "";

  switch (type) {
    case EmailType.OTP_VERIFICATION:
      subject = "Verify Your Account";
      html = `
        <h2>Account Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires at: ${expiresAt?.toLocaleString()}</p>
      `;
      break;

    case EmailType.BOOKING_CONFIRMATION:
      subject = "Confirm Your Event Booking";
      html = `
        <h2>Event Booking Confirmation</h2>
        <p>Your booking OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires at: ${expiresAt?.toLocaleString()}</p>
      `;
      break;

    case EmailType.THANK_YOU:
      subject = "Thank You 🎉";
      html = `
        <h2>Booking Confirmed!</h2>
        <p>Thank you for booking ${eventName}</p>
      `;
      break;
  }

  await transporter.sendMail({
    from: `"Event App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};