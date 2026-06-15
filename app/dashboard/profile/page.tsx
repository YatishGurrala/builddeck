import Link from "next/link";
import { ArrowLeft, ExternalLink, Save } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileAvatarField } from "@/components/dashboard/profile-avatar-field";
import { getCurrentUser } from "@/lib/auth/utils";
import { FOUNDER_THEME_LIST } from "@/lib/founder-profile/themes";
import { getFounderBlocksForUser, getFounderProfileForUser } from "@/lib/founder-profile/store";
import { getFounderPublicProfileUrl } from "@/lib/founder-profile/public-url";
import { applyFounderTheme, saveFounderProfile } from "@/actions/founder-profile";
import { FounderDashboardNav } from "../_components/founder-dashboard-nav";

export const metadata = { title: "Profile · Dashboard · Builddeck" };

export default async function DashboardProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getFounderProfileForUser(user);
  const blocks = await getFounderBlocksForUser(user);
  const founderPublicUrl = getFounderPublicProfileUrl(profile.username);
  const activeBlockTypes = new Set(blocks.filter((block) => block.isActive).map((block) => block.type));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--on-surface-variant)] hover:text-[color:var(--on-surface)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <Link
          href={founderPublicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
        >
          View public profile <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[color:var(--on-surface)]">Founder Profile</h1>
        <p className="mt-1 text-[color:var(--on-surface-variant)]">
          Edit your public founder identity. Lives at <code className="text-cyan-700 dark:text-cyan-300">{founderPublicUrl}</code>.
        </p>
      </header>

      <FounderDashboardNav active="profile" />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveFounderProfile} className="space-y-4">
              <Field label="Username">
                <Input name="username" defaultValue={profile.username} placeholder="yourname" />
              </Field>
              <Field label="Display name">
                <Input name="displayName" defaultValue={profile.displayName} />
              </Field>
              <ProfileAvatarField initialAvatarUrl={profile.avatarUrl || ""} displayName={profile.displayName} />
              <Field label="Headline">
                <Input name="headline" defaultValue={profile.headline} />
              </Field>
              <Field label="Bio">
                <Textarea name="bio" defaultValue={profile.bio ?? ""} rows={4} />
              </Field>
              <p className="text-xs text-[color:var(--on-surface-variant)]">
                Edit your current project from the Products tab.
              </p>
              {activeBlockTypes.has("featured-content") ? (
                <>
                  <div className="border-t border-[color:var(--outline-variant)] pt-4">
                    <p className="text-sm font-semibold text-[color:var(--on-surface)]">Featured content</p>
                    <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">Spotlight one link, post, or offer near the top of your page.</p>
                  </div>
                  <Field label="Featured content title">
                    <Input name="featuredContentTitle" defaultValue={profile.featuredContent?.title ?? ""} />
                  </Field>
                  <Field label="Featured content description">
                    <Textarea name="featuredContentDescription" defaultValue={profile.featuredContent?.description ?? ""} rows={3} />
                  </Field>
                  <Field label="Featured content URL">
                    <Input name="featuredContentUrl" defaultValue={profile.featuredContent?.url ?? ""} placeholder="https://..." />
                  </Field>
                </>
              ) : null}
              {activeBlockTypes.has("video-embed") ? (
                <>
                  <div className="border-t border-[color:var(--outline-variant)] pt-4">
                    <p className="text-sm font-semibold text-[color:var(--on-surface)]">Video embed</p>
                    <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">Paste a YouTube or Vimeo URL to render an embedded video on the public page.</p>
                  </div>
                  <Field label="Video title">
                    <Input name="videoEmbedTitle" defaultValue={profile.videoEmbed?.title ?? ""} />
                  </Field>
                  <Field label="Video URL">
                    <Input name="videoEmbedUrl" defaultValue={profile.videoEmbed?.url ?? ""} placeholder="https://youtube.com/watch?v=..." />
                  </Field>
                </>
              ) : null}
              {activeBlockTypes.has("testimonial") ? (
                <>
                  <div className="border-t border-[color:var(--outline-variant)] pt-4">
                    <p className="text-sm font-semibold text-[color:var(--on-surface)]">Testimonial</p>
                    <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">Add one proof point from a client, reader, customer, or peer.</p>
                  </div>
                  <Field label="Quote">
                    <Textarea name="testimonialQuote" defaultValue={profile.testimonial?.quote ?? ""} rows={3} />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Author">
                      <Input name="testimonialAuthor" defaultValue={profile.testimonial?.author ?? ""} />
                    </Field>
                    <Field label="Role">
                      <Input name="testimonialRole" defaultValue={profile.testimonial?.role ?? ""} />
                    </Field>
                  </div>
                </>
              ) : null}
              {activeBlockTypes.has("newsletter") ? (
                <>
                  <div className="border-t border-[color:var(--outline-variant)] pt-4">
                    <p className="text-sm font-semibold text-[color:var(--on-surface)]">Newsletter</p>
                    <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">These fields only appear while the newsletter block is active.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Newsletter title">
                      <Input name="newsletterHeadline" defaultValue={profile.newsletterCta?.headline ?? ""} />
                    </Field>
                    <Field label="Newsletter CTA label">
                      <Input name="newsletterCtaLabel" defaultValue={profile.newsletterCta?.ctaLabel ?? ""} />
                    </Field>
                  </div>
                  <Field label="Newsletter description">
                    <Textarea name="newsletterDescription" defaultValue={profile.newsletterCta?.description ?? ""} rows={3} />
                  </Field>
                  <Field label="Newsletter URL">
                    <Input name="newsletterCtaUrl" defaultValue={profile.newsletterCta?.ctaUrl ?? ""} placeholder="https://..." />
                  </Field>
                </>
              ) : null}
              <div className="flex justify-end pt-2">
                <Button className="gap-2" type="submit">
                  <Save className="h-4 w-4" /> Save changes
                </Button>
              </div>
            </form>
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
                <form key={theme.id} action={applyFounderTheme}>
                  <input type="hidden" name="theme" value={theme.id} />
                  <button
                    type="submit"
                    className={
                      "w-full rounded-xl border p-4 text-left transition-colors " +
                      (selected
                        ? "border-cyan-400/50 bg-cyan-400/5"
                        : "border-[color:var(--outline-variant)] bg-[color:var(--surface-container-low)] hover:border-[color:var(--outline)]")
                    }
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[color:var(--on-surface)]">{theme.label}</p>
                      {selected ? (
                        <Badge variant="active">Active</Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-[color:var(--on-surface-variant)]">{theme.description}</p>
                  </button>
                </form>
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
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[color:var(--on-surface-variant)]">
        {label}
      </span>
      {children}
    </label>
  );
}
