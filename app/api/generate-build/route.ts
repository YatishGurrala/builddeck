import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { sendBuildGeneratedEmail } from "@/lib/resend";

type BuildOutput = {
  overview: string;
  features: string[];
  techStack: string[];
  uiPlan: string;
  backendPlan: string;
};

function buildMockOutput(idea: string): BuildOutput {
  return {
    overview: `BuildDeck plan for: ${idea}`,
    features: [
      "User onboarding and workspace setup",
      "Core workflow automation for the idea",
      "Analytics dashboard with key usage metrics",
    ],
    techStack: ["Next.js", "TypeScript", "Prisma", "Supabase", "Hostinger SMTP"],
    uiPlan:
      "Landing page, authenticated dashboard, build detail view, and service inquiry CTA under the generated output.",
    backendPlan:
      "POST /api/generate-build for generation, authenticated persistence in Build table, plus lead capture endpoint for service inquiries.",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { idea?: string };
    const idea = body?.idea?.trim();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required." }, { status: 400 });
    }

    const output = buildMockOutput(idea);
    const session = await auth();

    if (session?.user?.id) {
      await prisma.build.create({
        data: {
          userId: session.user.id,
          idea,
          output,
        },
      });

      if (session.user.email) {
        await sendBuildGeneratedEmail(session.user.email, idea);
      }

      return NextResponse.json({ output, saved: true }, { status: 200 });
    }

    return NextResponse.json({ output, saved: false }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to generate build." }, { status: 500 });
  }
}
