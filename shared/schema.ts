import { pgTable, text, serial, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Partners table
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertPartnerSchema = createInsertSchema(partners).pick({
  name: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

// Distributions table
export const distributions = pgTable("distributions", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
  totalAmount: real("total_amount").notNull(),
  totalHours: real("total_hours").notNull(),
  hourlyRate: real("hourly_rate").notNull(),
  partnerData: jsonb("partner_data").notNull(),
});

export const insertDistributionSchema = createInsertSchema(distributions).pick({
  totalAmount: true,
  totalHours: true,
  hourlyRate: true,
  partnerData: true,
});

export type InsertDistribution = z.infer<typeof insertDistributionSchema>;
export type Distribution = typeof distributions.$inferSelect;

// PartnerPayouts schema for the frontend
export type PartnerPayout = {
  id?: number;
  name: string;
  hours: number;
  payout: number;
  rounded: number;
  billBreakdown: Array<{
    quantity: number;
    denomination: number;
  }>;
}

// Schema for OCR extraction validation
export const partnerHoursSchema = z.array(
  z.object({
    name: z.string().min(1, "Partner name is required"),
    hours: z.number().positive("Hours must be positive")
  })
);

export type PartnerHours = z.infer<typeof partnerHoursSchema>;

// Distribution data with all computed values
export type DistributionData = {
  totalAmount: number;
  totalHours: number;
  hourlyRate: number;
  partnerPayouts: PartnerPayout[];
}
