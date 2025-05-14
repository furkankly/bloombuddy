import { pgTable, integer, doublePrecision, text } from "drizzle-orm/pg-core";

// Plants table
export const plants = pgTable("plants", {
  name: text("name").primaryKey().unique().notNull(),
  weeklyWaterNeed: doublePrecision("weekly_water_need").notNull(),
  expectedHumidity: integer("expected_humidity").notNull(),
});
