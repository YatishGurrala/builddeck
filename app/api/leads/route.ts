import { NextResponse } from "next/server";
import { createRecord } from "@/lib/buildstack/records";
import { sendLeadSubmittedEmail } from "@/lib/resend";

interface LeadData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    await createRecord<LeadData>("leads", email, { name, email, message });

    await sendLeadSubmittedEmail(email, name);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit lead." }, { status: 500 });
  }
}
