import { requireAdmin } from "@/lib/auth/utils";
import { getReachDebugSnapshot } from "@/lib/hostinger-reach";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminReachPage() {
  await requireAdmin();

  const snapshot = await getReachDebugSnapshot();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reach Debug</h1>
        <p className="mt-1 text-zinc-400">
          Verify Maker Digest contact sync, inspect Reach profiles, and confirm the correct profile UUID.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatusCard
          title="API Token"
          value={snapshot.tokenConfigured ? "Configured" : "Missing"}
          tone={snapshot.tokenConfigured ? "success" : "warning"}
        />
        <StatusCard
          title="Selected Profile UUID"
          value={snapshot.profileUuid || "Not set"}
          tone={snapshot.profileUuid ? "success" : "warning"}
        />
        <StatusCard
          title="Welcome Email Owner"
          value={snapshot.welcomeManaged ? "Hostinger Reach" : "App SMTP fallback"}
          tone="default"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reach Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            {snapshot.profilesError ? (
              <p className="text-sm text-amber-300">{snapshot.profilesError}</p>
            ) : snapshot.profiles.length === 0 ? (
              <p className="text-sm text-zinc-400">No profiles returned.</p>
            ) : (
              <div className="space-y-3">
                {snapshot.profiles.map((profile) => (
                  <div
                    key={profile.uuid || profile.name || profile.title}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                  >
                    <p className="font-medium text-white">{profile.name || profile.title || "Unnamed profile"}</p>
                    <p className="mt-1 break-all text-xs text-zinc-400">UUID: {profile.uuid || "Unavailable"}</p>
                    {profile.description ? (
                      <p className="mt-2 text-sm text-zinc-300">{profile.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Groups</CardTitle>
          </CardHeader>
          <CardContent>
            {snapshot.groupsError ? (
              <p className="text-sm text-amber-300">{snapshot.groupsError}</p>
            ) : snapshot.groups.length === 0 ? (
              <p className="text-sm text-zinc-400">No contact groups returned.</p>
            ) : (
              <div className="space-y-3">
                {snapshot.groups.map((group) => (
                  <div
                    key={group.uuid || group.title}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                  >
                    <p className="font-medium text-white">{group.title || "Untitled group"}</p>
                    <p className="mt-1 break-all text-xs text-zinc-400">UUID: {group.uuid || "Unavailable"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "default" | "success" | "warning";
}) {
  const badgeTone =
    tone === "success" ? "success" : tone === "warning" ? "warning" : "secondary";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-sm text-white break-all">{value}</p>
        <Badge variant={badgeTone}>{tone}</Badge>
      </CardContent>
    </Card>
  );
}