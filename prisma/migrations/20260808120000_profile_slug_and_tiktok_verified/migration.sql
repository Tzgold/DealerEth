-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN "tiktokVerifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ClientProfile" ADD COLUMN "slug" TEXT;

-- Backfill unique brand slugs from company names
UPDATE "ClientProfile"
SET slug = lower(
  regexp_replace(
    regexp_replace(coalesce(nullif(trim("companyName"), ''), 'brand'), '[^a-zA-Z0-9]+', '-', 'g'),
    '(^-|-$)',
    '',
    'g'
  )
);

UPDATE "ClientProfile"
SET slug = 'brand-' || substr(id, 1, 8)
WHERE slug IS NULL OR slug = '';

-- Deduplicate colliding slugs
WITH ranked AS (
  SELECT
    id,
    slug,
    row_number() OVER (PARTITION BY slug ORDER BY "createdAt", id) AS rn
  FROM "ClientProfile"
)
UPDATE "ClientProfile" AS c
SET slug = c.slug || '-' || ranked.rn::text
FROM ranked
WHERE c.id = ranked.id AND ranked.rn > 1;

CREATE UNIQUE INDEX "ClientProfile_slug_key" ON "ClientProfile"("slug");

ALTER TABLE "ClientProfile" ALTER COLUMN "slug" SET NOT NULL;
