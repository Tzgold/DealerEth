import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionUser } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSessionUser();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CREATOR") {
    redirect("/client/dashboard");
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: session.userId },
    include: {
      dealRequests: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) {
    redirect("/profile/setup");
  }

  async function logout() {
    "use server";

    await clearSessionCookie();
    redirect("/login");
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Welcome, {profile.name}</h1>
          <p className="text-sm text-zinc-600">
            Public page: <Link href={`/@${profile.username}`} className="underline">/@{profile.username}</Link>
          </p>
        </div>
        <form action={logout}>
          <Button variant="secondary" type="submit">
            Logout
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold">Incoming deal requests</h2>
        <div className="mt-3 space-y-3">
          {profile.dealRequests.length === 0 ? (
            <p className="text-sm text-zinc-600">No requests yet.</p>
          ) : (
            profile.dealRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-black/10 bg-zinc-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{request.name}</p>
                  <p className="text-xs text-zinc-600">Budget: {request.budget}</p>
                </div>
                <p className="mt-1 text-sm text-zinc-700">{request.description}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
