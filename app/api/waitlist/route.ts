import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import {
  createWaitlistLead,
  getWaitlistLeadByEmail,
} from "@/lib/buildstack/queries/waitlist";

interface WaitlistRequestBody {
  email?: string;
  source?: string;
}

const SUCCESS_MESSAGE = "You’re on the Builddeck waitlist.";
const DUPLICATE_MESSAGE = "This email already exists on the waitlist.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as WaitlistRequestBody;

    const inputEmail = body.email?.trim();
    const source = body.source?.trim() || "builddeck-landing";

    const validation = newsletterSchema.safeParse({ email: inputEmail });
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = validation.data.email.toLowerCase();

    const existingLead = await getWaitlistLeadByEmail(normalizedEmail);
    if (existingLead) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message: DUPLICATE_MESSAGE,
      });
    }

    await createWaitlistLead(normalizedEmail, source);

    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGE,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
