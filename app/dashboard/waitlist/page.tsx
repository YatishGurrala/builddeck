import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth/utils";
import { getWaitlistLeadCount, getWaitlistLeads } from "@/lib/db/queries/waitlist";

export default async function WaitlistDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [leads, totalLeads] = await Promise.all([
    getWaitlistLeads(),
    getWaitlistLeadCount(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Waitlist Leads</h1>
        <p className="mt-1 text-zinc-400">Collected from the Builddeck landing page.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{totalLeads}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-zinc-400">No waitlist leads yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="pb-3 pr-4 text-xs uppercase tracking-wider text-zinc-500">Email</th>
                    <th className="pb-3 pr-4 text-xs uppercase tracking-wider text-zinc-500">Source</th>
                    <th className="pb-3 text-xs uppercase tracking-wider text-zinc-500">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-zinc-900/80">
                      <td className="py-3 pr-4 text-sm text-white">{lead.email}</td>
                      <td className="py-3 pr-4 text-sm text-zinc-300">{lead.source || "-"}</td>
                      <td className="py-3 text-sm text-zinc-400">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
