import {
  pgSchema,
  serial,
  varchar,
  jsonb,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

// Define the schema
export const oneAuto = pgSchema("one_auto");

// Define the "device" table within the schema
export const device = oneAuto.table("device", {
  id: serial("id").primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  data: jsonb("data").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Define the "device_commands" table within the schema
export const deviceCommands = oneAuto.table("device_commands", {
  id: serial("id").primaryKey(),
  uid: varchar("uid", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  commands: jsonb("commands").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
