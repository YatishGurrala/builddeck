import nodemailer from "nodemailer";

const fromEmail = process.env.EMAIL_FROM || "BuildDeck <hello@builddeck.io>";

function getTransporter() {
  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_SERVER_PORT || 465),
    secure: process.env.EMAIL_SERVER_SECURE !== "false",
    auth: {
      user,
      pass,
    },
  });
}

async function sendEmail(options: { to: string; subject: string; html: string }) {
  const transporter = getTransporter();

  if (!transporter) {
    return { success: false, error: "SMTP email is not configured" };
  }

  await transporter.sendMail({
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  return { success: true };
}

export async function sendNewsletterConfirmation(email: string) {
  try {
    await sendEmail({
      to: email,
      subject: "Welcome to Builddeck Newsletter!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b5cf6;">Welcome to Builddeck! 🚀</h1>
          <p>Thanks for subscribing to our newsletter.</p>
          <p>You'll be the first to know about:</p>
          <ul>
            <li>New product launches</li>
            <li>Featured products</li>
            <li>Indie hacker tips</li>
          </ul>
          <p>Stay tuned!</p>
          <p style="color: #666;">— The Builddeck Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send confirmation email" };
  }
}

export async function sendProductApprovalEmail(
  email: string,
  productName: string,
  productSlug: string
) {
  try {
    const productUrl = `${process.env.NEXT_PUBLIC_APP_URL}/products/${productSlug}`;
    
    await sendEmail({
      to: email,
      subject: `Your product "${productName}" has been approved!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b5cf6;">Great news! 🎉</h1>
          <p>Your product <strong>${productName}</strong> has been approved and is now live on Builddeck!</p>
          <p>
            <a href="${productUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Your Product
            </a>
          </p>
          <p style="color: #666;">— The Builddeck Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send approval email" };
  }
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  try {
    await sendEmail({
      to: email,
      subject: "Welcome to BuildDeck",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0070f3;">Welcome to BuildDeck</h1>
          <p>Hi ${name || "there"},</p>
          <p>Thanks for joining BuildDeck. You can now generate and save structured build plans from your product ideas.</p>
          <p style="color: #666;">- The BuildDeck Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error: "Failed to send welcome email" };
  }
}

export async function sendBuildGeneratedEmail(email: string, idea: string) {
  try {
    await sendEmail({
      to: email,
      subject: "Your BuildDeck plan is ready",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0070f3;">Build generated successfully</h1>
          <p>Your idea has been processed and saved in your dashboard.</p>
          <p><strong>Idea:</strong> ${idea}</p>
          <p style="color: #666;">- The BuildDeck Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send build generated email:", error);
    return { success: false, error: "Failed to send build generated email" };
  }
}

export async function sendLeadSubmittedEmail(email: string, name: string) {
  try {
    await sendEmail({
      to: email,
      subject: "We received your BuildDeck inquiry",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0070f3;">Thanks for reaching out</h1>
          <p>Hi ${name},</p>
          <p>We received your service inquiry and will get back to you shortly.</p>
          <p style="color: #666;">- The BuildDeck Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send lead submitted email:", error);
    return { success: false, error: "Failed to send lead submitted email" };
  }
}
