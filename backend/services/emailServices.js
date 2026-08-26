import nodemailer from 'nodemailer';

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Sends inquiry alert email to admin
 * @param {Object} details - Inquiry and property details
 */
export const sendInquiryEmail = async ({ inquiry, property }) => {
  // If email credentials are not configured, log to console and exit gracefully
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[EmailService] Credentials not set. Skipping email delivery.');
    return;
  }

  const transporter = createTransporter();
  const propertyTitle = escapeHtml(property?.title || 'General inquiry');
  const name = escapeHtml(inquiry.name);
  const email = escapeHtml(inquiry.email);
  const phone = escapeHtml(inquiry.phone);
  const location = property ? escapeHtml(`${property.location}, ${property.city}`) : 'No specific property selected';
  const message = escapeHtml(inquiry.message);

  const mailOptions = {
    from: `"Boutique Real Estate" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Agency inbox receives the inquiry
    subject: `New Lead: ${property?.title || 'General inquiry'}`,
    html: `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #E8E5DF; background-color: #FAF8F5; color: #1E1E1E;">
        <h2 style="font-family: 'Playfair Display', Georgia, serif; color: #8C4A32; border-bottom: 2px solid #8C4A32; padding-bottom: 8px;">
          New Property Inquiry
        </h2>
        <p style="font-size: 15px; line-height: 1.6;">You have received a new inquiry regarding: <strong>${propertyTitle}</strong>${property ? ` (NPR ${property.price.toLocaleString()})` : '.'}</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9; color: #6E685F;"><strong>Client Name:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9; color: #6E685F;"><strong>Email:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9;"><a href="mailto:${email}" style="color: #8C4A32;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9; color: #6E685F;"><strong>Phone:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9;"><a href="tel:${phone}" style="color: #8C4A32;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9; color: #6E685F;"><strong>Property City / Location:</strong></td>
            <td style="padding: 8px 0; border-bottom: 1px solid #E2DED9;">${location}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 16px; background-color: #FFFFFF; border-left: 4px solid #8C4A32;">
          <strong style="color: #1E1E1E; display: block; margin-bottom: 6px;">Client Message:</strong>
          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #3A3834;">${message}</p>
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #9B948A;">Boutique Real Estate Agency &bull; Automated Inquiry Notification</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Inquiry email successfully dispatched for: ${property?.title || 'general inquiry'}`);
  } catch (error) {
    console.error('[EmailService] Failed to send email:', error.message);
  }
};