import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Github, Linkedin, Globe, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DraggableLinkManager from "@/components/dashboard/draggable-link-manager";
import { addFounderLink, saveFounderSocialLinks } from "@/actions/founder-profile";
import { getCurrentUser } from "@/lib/auth/utils";
import { getFounderProfileForUser } from "@/lib/founder-profile/store";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";
import { XLogo } from "@/components/icons/x-logo";

export const metadata = { title: "Links · Dashboard · Builddeck" };

export default async function DashboardLinksPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getFounderProfileForUser(user);
  const links = [...profile.links].sort((a, b) => a.position - b.position);
  const socialMap = new Map(profile.socials.map((social) => [social.platform.toLowerCase(), social.url]));

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[color:var(--on-surface)]">Links</h1>
          <p className="mt-1 text-[color:var(--on-surface-variant)]">
            Manage links that appear on your public profile.
          </p>
        </div>
        <form action={addFounderLink} className="flex w-full max-w-xl items-end gap-2">
          <Input name="title" placeholder="New link title" required />
          <Input name="url" placeholder="https://..." required />
          <Button className="gap-2" type="submit">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </form>
      </div>

      <FounderDashboardNav active="links" />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <DraggableLinkManager links={links} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Social Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveFounderSocialLinks} className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 rounded-md border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3">
              <Linkedin className="h-4 w-4 text-[color:var(--on-surface-variant)]" />
              <Input
                name="linkedin"
                placeholder="https://linkedin.com/in/..."
                defaultValue={socialMap.get("linkedin") || ""}
                className="border-0 bg-transparent px-0"
              />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3">
              <XLogo className="h-4 w-4 text-[color:var(--on-surface-variant)]" />
              <Input
                name="x"
                placeholder="https://x.com/..."
                defaultValue={socialMap.get("x") || socialMap.get("twitter") || ""}
                className="border-0 bg-transparent px-0"
              />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3">
              <Github className="h-4 w-4 text-[color:var(--on-surface-variant)]" />
              <Input
                name="github"
                placeholder="https://github.com/..."
                defaultValue={socialMap.get("github") || ""}
                className="border-0 bg-transparent px-0"
              />
            </label>
            <label className="flex items-center gap-2 rounded-md border border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] px-3">
              <Globe className="h-4 w-4 text-[color:var(--on-surface-variant)]" />
              <Input
                name="website"
                placeholder="https://your-site.com"
                defaultValue={socialMap.get("website") || socialMap.get("site") || ""}
                className="border-0 bg-transparent px-0"
              />
            </label>
            <div className="md:col-span-2 flex justify-end">
              <Button className="gap-2" type="submit">
                <Save className="h-4 w-4" /> Save social profiles
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Add Link Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addFounderLink} className="grid gap-3 md:grid-cols-2">
            <Input name="title" placeholder="Title" required />
            <Input name="url" placeholder="https://..." required />
            <div className="md:col-span-2">
              <Textarea name="description" placeholder="Description (optional)" rows={3} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button className="gap-2" type="submit">
                <Plus className="h-4 w-4" /> Add link
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
