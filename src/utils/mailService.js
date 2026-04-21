import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  getAdminRetreatBookingTemplate,
  getAdminTherapyRequestTemplate,
  getRetreatBookingTemplate,
  getTherapyRequestTemplate,
} from "./mailTemplate.js";
import { createLogger } from "./logger.js";

dotenv.config({ path: "./src/config/.env" });

const logger = createLogger({ module: "mail-service" });

export const sendTherapyRequestMail = async (
  userEmail,
  userName,
  drName,
  slotTime,
  slotDate,
  age,
  gender,
  phone,
  concern,
  language,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SENDER_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const userMailOptions = {
      from: `"Wellness Support" <${process.env.MAIL_SENDER_EMAIL}>`,
      to: userEmail,
      subject: "Request raised for the therapy session",
      html: getTherapyRequestTemplate(userName, drName, slotTime, slotDate),
    };

    const adminMailOptions = {
      from: `"Wellness Support" <${process.env.MAIL_SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New therapy session request",
      html: getAdminTherapyRequestTemplate(
        userName,
        userEmail,
        drName,
        slotTime,
        slotDate,
        age,
        gender,
        phone,
        concern,
        language,
      ),
    };

    const [userInfo, adminInfo] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    logger.info(
      {
        userMessageId: userInfo.messageId,
        adminMessageId: adminInfo.messageId,
        userEmail,
        adminEmail: process.env.ADMIN_EMAIL,
      },
      "Therapy request emails sent",
    );

    return {
      success: true,
      message: "User and Admin emails sent successfully",
      userMessageId: userInfo.messageId,
      adminMessageId: adminInfo.messageId,
    };
  } catch (error) {
    logger.failure("Therapy request email sending failed", error, {
      userEmail,
      adminEmail: process.env.ADMIN_EMAIL,
    });

    return {
      success: false,
      message: "Failed to send email(s). Please check SMTP configuration.",
      error: error.message,
    };
  }
};

export const sendRetreatRequestMail = async (
  userEmail,
  userName,
  packageName,
  seats,
  totalAmount,
  travelDate,
  phone,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_SENDER_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const userMailOptions = {
      from: `"Wellness Retreats" <${process.env.MAIL_SENDER_EMAIL}>`,
      to: userEmail,
      subject: `Retreat Request: ${packageName}`,
      html: getRetreatBookingTemplate(
        userName,
        packageName,
        seats,
        totalAmount,
        travelDate,
      ),
    };

    const adminMailOptions = {
      from: `"Wellness Retreats" <${process.env.MAIL_SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Retreat Request: ${packageName}`,
      html: getAdminRetreatBookingTemplate(
        userName,
        userEmail,
        packageName,
        seats,
        totalAmount,
        travelDate,
        phone,
      ),
    };

    const [userInfo, adminInfo] = await Promise.all([
      transporter.sendMail(userMailOptions),
      transporter.sendMail(adminMailOptions),
    ]);

    logger.info(
      {
        userMessageId: userInfo.messageId,
        adminMessageId: adminInfo.messageId,
        userEmail,
        adminEmail: process.env.ADMIN_EMAIL,
      },
      "Retreat request emails sent",
    );

    return {
      success: true,
      userMessageId: userInfo.messageId,
      adminMessageId: adminInfo.messageId,
    };
  } catch (error) {
    logger.failure("Retreat email sending failed", error, {
      userEmail,
      adminEmail: process.env.ADMIN_EMAIL,
    });

    return {
      success: false,
      message: "Retreat email failed to send.",
      error: error.message,
    };
  }
};
