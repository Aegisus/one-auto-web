ALTER TABLE "one_auto"."device" ADD COLUMN "uid" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "one_auto"."device_commands" ADD COLUMN "uid" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "one_auto"."device_commands" DROP COLUMN IF EXISTS "description";