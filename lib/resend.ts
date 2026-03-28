import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewsletterConfirmation(email: string) {
  try {
    await resend.emails.send({
      from: "Builddeck <onboarding@resend.dev>",
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
    
    await resend.emails.send({
      from: "Builddeck <onboarding@resend.dev>",
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
