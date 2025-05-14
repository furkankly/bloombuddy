CREATE TABLE "plants" (
	"name" text PRIMARY KEY NOT NULL,
	"weekly_water_need" double precision NOT NULL,
	"expected_humidity" integer NOT NULL,
	CONSTRAINT "plants_name_unique" UNIQUE("name")
);
