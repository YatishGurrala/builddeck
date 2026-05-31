import Link from "next/link";
import { ArrowLeft, Eye, UploadCloud } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DraggableBlockList } from "@/components/dashboard/draggable-block-list";
import { FounderProfileSections } from "@/components/founder-profile/founder-profile-sections";
import { getCurrentUser } from "@/lib/auth/utils";
import { getFounderBlocksForUser, getFounderProfileForUser } from "@/lib/founder-profile/store";
import { getFounderPublicProfileUrl } from "@/lib/founder-profile/public-url";
import { toggleFounderPublish } from "@/actions/founder-profile";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Editor · Dashboard · Builddeck" };

export default async function DashboardEditorPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getFounderProfileForUser(user);
  const founderPublicUrl = getFounderPublicProfileUrl(profile.username);
  const blocks = await getFounderBlocksForUser(user);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Link href={founderPublicUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" /> Preview
            </Button>
          </Link>
          <form action={toggleFounderPublish}>
            <Button className="gap-2" type="submit" variant={profile.isPublished ? "outline" : "default"}>
              <UploadCloud className="h-4 w-4" /> {profile.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </form>
        </div>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Builddeck Editor</h1>
        <p className="mt-1 text-zinc-400">
          Arrange profile blocks and shape your public creator page.
        </p>
      </header>

      <FounderDashboardNav active="editor" />

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle>Home Page Blocks</CardTitle>
            <Badge className={profile.isPublished ? "bg-emerald-400/15 text-emerald-300" : "bg-yellow-400/15 text-yellow-300"}>
              {profile.isPublished ? "Published" : "Draft"}
            </Badge>
          </CardHeader>
          <CardContent>
            <DraggableBlockList blocks={blocks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[720px] overflow-auto rounded-3xl border border-white/10 bg-[#0b1326] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <FounderProfileSections profile={profile} blocks={blocks} interactive={false} />
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Preview now mirrors the same block order and content rules as the public page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
