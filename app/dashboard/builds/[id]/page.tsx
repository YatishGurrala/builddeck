import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/utils";
import { getBuildByIdForUser } from "@/lib/buildstack/queries/builds";

type BuildOutput = {
  overview?: string;
  features?: string[];
  techStack?: string[];
  uiPlan?: string;
  backendPlan?: string;
};

interface BuildDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuildDetailPage({ params }: BuildDetailPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const build = await getBuildByIdForUser(id, user.id);

  if (!build) {
    notFound();
  }

  const output = build.data.output as BuildOutput;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-white">Build Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-200">{build.data.idea}</p>
          <p className="mt-2 text-xs text-zinc-500">Generated {formatDate(new Date(build.createdAt))}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Generated Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-zinc-100">Overview</h3>
            <p className="mt-1 text-zinc-300">{output.overview || "No overview available."}</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-100">Features</h3>
            <ul className="mt-1 list-disc pl-5 text-zinc-300">
              {(output.features || []).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-100">Tech Stack</h3>
            <p className="mt-1 text-zinc-300">{(output.techStack || []).join(", ")}</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-100">UI Plan</h3>
            <p className="mt-1 text-zinc-300">{output.uiPlan || "No UI plan available."}</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-100">Backend Plan</h3>
            <p className="mt-1 text-zinc-300">{output.backendPlan || "No backend plan available."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
