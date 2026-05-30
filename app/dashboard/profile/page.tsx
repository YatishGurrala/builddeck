import Link from "next/link";
import { ArrowLeft, ExternalLink, Save } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/lib/auth/utils";
import { getDefaultMockFounderProfile } from "@/lib/founder-profile/mock-data";
import { FOUNDER_THEME_LIST } from "@/lib/founder-profile/themes";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Profile · Dashboard · Builddeck" };

export default async function DashboardProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // MVP: read-only mock data. Server actions for persistence land in a
  // follow-up — `disabled` inputs prevent unsaved-data confusion.
  const profile = getDefaultMockFounderProfile();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <Link
          href={`/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
        >
          View public profile <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Founder Profile</h1>
        <p className="mt-1 text-zinc-400">
          Edit your public founder identity. Lives at <code className="text-cyan-300">/{profile.username}</code>.
        </p>
      </header>

      <FounderDashboardNav active="profile" />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Username">
              <Input defaultValue={profile.username} placeholder="yourname" disabled />
            </Field>
            <Field label="Display name">
              <Input defaultValue={profile.displayName} disabled />
            </Field>
            <Field label="Headline">
              <Input defaultValue={profile.headline} disabled />
            </Field>
            <Field label="Bio">
              <Textarea defaultValue={profile.bio ?? ""} rows={4} disabled />
            </Field>
            <Field label="Currently building">
              <Input defaultValue={profile.currentlyBuilding ?? ""} disabled />
            </Field>
            <div className="flex justify-end pt-2">
              <Button disabled className="gap-2">
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </div>
            <p className="text-xs text-zinc-500">
              Persistence lands in a follow-up. Public page is rendered from mock data today.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {FOUNDER_THEME_LIST.map((theme) => {
              const selected = theme.id === profile.theme;
              return (
                <div
                  key={theme.id}
                  className={
                    "rounded-xl border p-4 transition-colors " +
                    (selected
                      ? "border-cyan-400/50 bg-cyan-400/5"
                      : "border-white/10 bg-[#101419]")
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{theme.label}</p>
                    {selected ? (
                      <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
                        Active
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{theme.description}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}
