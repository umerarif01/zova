ALTER TABLE "chatbots" ALTER COLUMN "welcomeMessage" SET DEFAULT 'Hi! How can I help you today? 👋';--> statement-breakpoint
ALTER TABLE "chatbots" ALTER COLUMN "background" SET DEFAULT '#a855f7';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "no_of_chatbots" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "no_of_tokens" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "no_of_knowledge_sources" integer DEFAULT 0 NOT NULL;