import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ApplicationChatBox } from "@/components/forms/application-chat-box";
import { requireCreatorProfile } from "@/lib/dashboard-context";
import { prisma } from "@/lib/prisma";

export default async function CreatorMessageThreadPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params;
  const { profile } = await requireCreatorProfile();

  const application = await prisma.campaignApplication.findFirst({
    where: { id: applicationId, creatorId: profile.id },
    include: {
      campaign: { include: { client: { select: { companyName: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!application) notFound();

  return (
    <>
      <Link href="/dashboard/messages" className="text-sm font-semibold text-white/60 hover:text-white">
        Back to messages
      </Link>

      <section className="mt-4 rounded-2xl border border-white/10 bg-[#141416] p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Campaign thread</p>
            <h1 className="mt-1 text-xl font-black text-white">Conversation with brand team</h1>
            <p className="mt-1 text-sm text-white/60">
              {application.campaign.title} · {application.campaign.client.companyName}
            </p>
          </div>
          <StatusPill status={application.status} />
        </div>

        <div className="mt-5">
          <ApplicationChatBox
            key={application.id}
            applicationId={application.id}
            initialMessages={application.messages.map((m) => ({
              id: m.id,
              senderRole: m.senderRole,
              text: m.text,
              createdAt: m.createdAt.toISOString(),
            }))}
            viewerRole="CREATOR"
          />
        </div>
      </section>
    </>
  );
}
