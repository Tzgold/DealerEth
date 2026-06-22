-- Add workflow state without removing existing campaign or request data.
ALTER TABLE "CampaignPost" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'LIVE';
ALTER TABLE "DealRequest" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'NEW';
