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

export const sendEmail = async ({
  to,
  type,
  otp,
  expiresAt,
  eventName,
}: SendEmailParams) => {

  // Create transporter ONLY when function runs
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim(),
    },
  });

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

  try {
    await transporter.sendMail({
      from: `"Event App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    
  } catch (error: any) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};