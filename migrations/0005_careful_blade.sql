ALTER TABLE "chatbots" ADD COLUMN "model" text DEFAULT 'gpt-4o-mini';--> statement-breakpoint
ALTER TABLE "chatbots" DROP COLUMN IF EXISTS "";