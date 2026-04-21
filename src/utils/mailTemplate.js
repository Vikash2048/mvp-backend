export const getTherapyRequestTemplate = (
  userName,
  drName,
  slotTime,
  slotDate,
) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; color: #333;">
      <div style="background-color: #6A1BC2; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Request</h1>
      </div>

      <div style="padding: 30px; line-height: 1.6;">
        <p style="font-size: 18px; color: #456A7C;"><strong>Hello ${userName},</strong></p>
        
        <p>Your appointment request has been raised successfully! We have sent your request to <strong> ${drName}</strong> for the following slot:</p>
        
        <div style="background-color: #F9F6FF; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6A1BC2;">
          <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${slotDate}</p>
          <p style="margin: 5px 0;">⏰ <strong>Time:</strong> ${slotTime}</p>
        </div>

        <p>Our team will get in touch with you shortly on your registered mobile number to finalize the details.</p>
        
        <p>Thank you for connecting with us and taking a step toward your wellness.</p>
        
        <p style="margin-top: 30px;">Best Regards,<br><strong>Wellness Team</strong></p>
      </div>

      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #888;">
        <p style="margin: 0; font-style: italic; color: #6A1BC2; font-weight: bold;">
          Because Mental Health Matters
        </p>
      </div>
    </div>
  `;
};


export const getAdminTherapyRequestTemplate = (
  userName,
  userEmail,
  drName,
  slotTime,
  slotDate,
  age,
  gender,
  phone,
  concern,
  language
) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; color: #333;">
      
      <!-- Header -->
      <div style="background-color: #6A1BC2; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
          New Therapy Session Request
        </h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; line-height: 1.6;">
        <p style="font-size: 18px; color: #456A7C;">
          <strong>Hello Admin,</strong>
        </p>

        <p>
          A new therapy session request has been raised by a user. Below are the complete details:
        </p>

        <!-- User Details -->
        <div style="background-color: #F9F6FF; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6A1BC2;">
          <p style="margin: 5px 0;">👤 <strong>User Name:</strong> ${userName || "-"}</p>
          <p style="margin: 5px 0;">📧 <strong>User Email:</strong> ${userEmail || "-"}</p>
          <p style="margin: 5px 0;">📞 <strong>Phone:</strong> ${phone || "-"}</p>
          <p style="margin: 5px 0;">🎂 <strong>Age:</strong> ${age || "-"}</p>
          <p style="margin: 5px 0;">🚻 <strong>Gender:</strong> ${gender || "-"}</p>
        </div>

        <!-- Session Details -->
        <div style="background-color: #F9F6FF; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6A1BC2;">
          <p style="margin: 5px 0;">🧑‍⚕️ <strong>Therapist:</strong> ${drName || "-"}</p>
          <p style="margin: 5px 0;">📅 <strong>Date:</strong> ${slotDate || "-"}</p>
          <p style="margin: 5px 0;">⏰ <strong>Time:</strong> ${slotTime || "-"}</p>
          <p style="margin: 5px 0;">🌐 <strong>Language:</strong> ${language || "-"}</p>
        </div>

        <!-- Concern -->
        <div style="background-color: #FFF; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px dashed #6A1BC2;">
          <p style="margin: 0 0 5px 0;">📝 <strong>User Concern:</strong></p>
          <p style="margin: 0; color: #555;">
            ${concern || "Not specified"}
          </p>
        </div>

        <p>
          Please coordinate with the therapist and the user to confirm or reschedule the session as needed.
        </p>

        <p style="margin-top: 30px;">
          Regards,<br>
          <strong>Wellness System</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 14px; color: #888;">
        <p style="margin: 0; font-style: italic; color: #6A1BC2; font-weight: bold;">
          Internal Notification — Action Required
        </p>
      </div>

    </div>
  `;
};




export const getRetreatBookingTemplate = (
  userName,
  packageName,
  seats,
  totalAmount,
  travelDate,
) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #2c3e50;">
      <div style="background-color: #2D6A4F; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">Retreat Request Received</h1>
      </div>

      <div style="padding: 30px; line-height: 1.6; background-color: #ffffff;">
        <p style="font-size: 18px;"><strong>Dear ${userName},</strong></p>
        
        <p>Pack your bags! Your request for a wellness retreat has been successfully raised. Here are your booking details:</p>
        
        <div style="background-color: #F0F7F4; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px dashed #2D6A4F;">
          <p style="margin: 8px 0;">⛰️ <strong>Package:</strong> ${packageName}</p>
          <p style="margin: 8px 0;">📅 <strong>Travel Date:</strong> ${travelDate}</p>
          <p style="margin: 8px 0;">👥 <strong>Seats Reserved:</strong> ${seats} Person(s)</p>
          <p style="margin: 8px 0;">💰 <strong>Total Estimate:</strong> ₹${totalAmount}</p>
        </div>

        <p>Our travel concierge will contact you within 24 hours to confirm availability and assist with the payment process.</p>
        
        <p style="margin-top: 30px;">Warmly,<br><strong>Retreat Support Team</strong></p>
      </div>

      <div style="background-color: #F8F9FA; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; font-style: italic; color: #2D6A4F; font-weight: bold; font-size: 15px;">
          Because Mental Health Matters
        </p>
        <p style="font-size: 11px; color: #999; margin-top: 10px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
};


export const getAdminRetreatBookingTemplate = (
  userName,
  userEmail,
  packageName,
  seats,
  totalAmount,
  travelDate,
  phone
) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; color: #2c3e50;">
      
      <div style="background-color: #2D6A4F; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 1px;">
          New Retreat Booking Request
        </h1>
      </div>

      <div style="padding: 30px; line-height: 1.6; background-color: #ffffff;">
        <p style="font-size: 18px;"><strong>Hello Admin,</strong></p>
        
        <p>
          A new wellness retreat booking request has been submitted. Please find the details below:
        </p>
        
        <div style="background-color: #F0F7F4; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px dashed #2D6A4F;">
          <p style="margin: 8px 0;">👤 <strong>User Name:</strong> ${userName}</p>
          <p style="margin: 8px 0;">📧 <strong>User Email:</strong> ${userEmail}</p>
          <p style="margin: 8px 0;">📱 <strong>User Phone:</strong> ${phone}</p>
          <p style="margin: 8px 0;">⛰️ <strong>Package:</strong> ${packageName}</p>
          <p style="margin: 8px 0;">📅 <strong>Travel Date:</strong> ${travelDate}</p>
          <p style="margin: 8px 0;">👥 <strong>Seats:</strong> ${seats} Person(s)</p>
          <p style="margin: 8px 0;">💰 <strong>Total Estimate:</strong> ₹${totalAmount}</p>
        </div>

        <p>
          Please verify availability, coordinate with the retreat partner, and initiate the confirmation and payment process.
        </p>

        <p style="margin-top: 30px;">
          Regards,<br>
          <strong>Retreat Operations System</strong>
        </p>
      </div>

      <div style="background-color: #F8F9FA; padding: 20px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; font-style: italic; color: #2D6A4F; font-weight: bold; font-size: 15px;">
          Internal Notification — Action Required
        </p>
        <p style="font-size: 11px; color: #999; margin-top: 10px;">
          This is an internal system-generated email.
        </p>
      </div>
    </div>
  `;
};
