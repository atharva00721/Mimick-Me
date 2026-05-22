ALTER TABLE "agents" ADD COLUMN "calendly_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "calendly_access_token" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "calendly_refresh_token" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "calendly_token_expiry" timestamp;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "calendly_account_email" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "calendly_user_uri" varchar(255);