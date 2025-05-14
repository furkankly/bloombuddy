import { db } from "@/db";
import { plants } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Plant schema validation
const plantSchema = z.object({
  name: z.string().min(1, "Plant name is required").max(100),
  weeklyWaterNeed: z
    .number({ invalid_type_error: "Must be a number" })
    .positive("Must be a positive number"),
  expectedHumidity: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
});

// GET all plants
export async function GET() {
  try {
    const allPlants = await db.select().from(plants);

    return NextResponse.json(
      {
        data: { plants: allPlants },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching plants:", error);
    return NextResponse.json(
      {
        errors: ["Failed to fetch plants"],
      },
      { status: 500 },
    );
  }
}

// POST create a new plant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body with Zod
    const bodyValidationResult = plantSchema.safeParse(body);

    if (!bodyValidationResult.success) {
      return NextResponse.json(
        {
          errors: bodyValidationResult.error.errors.map((e) => e.message),
        },
        { status: 400 },
      );
    }

    const { name, weeklyWaterNeed, expectedHumidity } =
      bodyValidationResult.data;

    // Check if plant with same name already exists
    const existingPlant = await db
      .select()
      .from(plants)
      .where(eq(plants.name, name))
      .limit(1);

    if (existingPlant.length > 0) {
      return NextResponse.json(
        {
          errors: [`A plant named '${name}' already exists`],
        },
        { status: 409 },
      ); // Conflict
    }

    // Insert the new plant
    const [newPlant] = await db
      .insert(plants)
      .values({
        name,
        weeklyWaterNeed,
        expectedHumidity,
      })
      .returning();

    return NextResponse.json(
      {
        data: { plant: newPlant },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating plant:", error);
    return NextResponse.json(
      {
        errors: ["Failed to create plant"],
      },
      { status: 500 },
    );
  }
}
