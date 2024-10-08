CREATE SCHEMA "one_auto";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "one_auto"."device" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "one_auto"."device_commands" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"commands" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
