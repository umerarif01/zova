CREATE TABLE IF NOT EXISTS "recent_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_product_id" text,
	"plan_name" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recent_subscriptions_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "recent_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recent_subscriptions" ADD CONSTRAINT "recent_subscriptions_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
