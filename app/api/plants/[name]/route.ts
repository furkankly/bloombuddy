import { db } from "@/db";
import { plants } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Define your schema for URL parameters
const ParamsSchema = z.object({
  name: z.string().min(1),
});

// Plant schema validation
const plantSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  weeklyWaterNeed: z
    .number({ invalid_type_error: "Must be a number" })
    .positive("Must be a positive number"),
  expectedHumidity: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),
});

// GET a single plant by name
export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ name: string }> },
) {
  try {
    const params = await props.params;
    const paramsValidationResult = ParamsSchema.safeParse(params);

    if (!paramsValidationResult.success) {
      return NextResponse.json(
        {
          errors: paramsValidationResult.error.errors.map((e) => e.message),
        },
        { status: 400 },
      );
    }

    const [plant] = await db
      .select()
      .from(plants)
      .where(eq(plants.name, paramsValidationResult.data.name))
      .limit(1);

    if (!plant) {
      return NextResponse.json(
        {
          errors: ["Plant not found"],
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        data: { plant },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching plant:", error);
    return NextResponse.json(
      {
        errors: ["Failed to fetch plant"],
      },
      { status: 500 },
    );
  }
}

// PUT update a plant by name
export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ name: string }> },
) {
  try {
    const params = await props.params;
    const paramsValidationResult = ParamsSchema.safeParse(params);

    if (!paramsValidationResult.success) {
      return NextResponse.json(
        {
          errors: paramsValidationResult.error.errors.map((e) => e.message),
        },
        { status: 400 },
      );
    }

    // Check if plant exists
    const [existingPlant] = await db
      .select()
      .from(plants)
      .where(eq(plants.name, paramsValidationResult.data.name))
      .limit(1);

    if (!existingPlant) {
      return NextResponse.json(
        {
          errors: ["Plant not found"],
        },
        { status: 404 },
      );
    }

    const body = await req.json();

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

    // Check if updated name conflicts with another plant
    if (name !== existingPlant.name) {
      const [nameConflict] = await db
        .select()
        .from(plants)
        .where(eq(plants.name, name))
        .limit(1);

      if (nameConflict) {
        return NextResponse.json(
          {
            errors: [`A plant named '${name}' already exists`],
          },
          { status: 409 },
        ); // Conflict
      }
    }

    // Update the plant
    const [updatedPlant] = await db
      .update(plants)
      .set({
        name,
        weeklyWaterNeed,
        expectedHumidity,
      })
      .where(eq(plants.name, name))
      .returning();

    return NextResponse.json(
      {
        data: { plant: updatedPlant },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating plant:", error);
    return NextResponse.json(
      {
        errors: ["Failed to update plant"],
      },
      { status: 500 },
    );
  }
}

// DELETE a plant by name
export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ name: string }> },
) {
  try {
    const params = await props.params;
    const paramsValidationResult = ParamsSchema.safeParse(params);

    if (!paramsValidationResult.success) {
      return NextResponse.json(
        {
          errors: paramsValidationResult.error.errors.map((e) => e.message),
        },
        { status: 400 },
      );
    }

    // Check if plant exists before deletion
    const [existingPlant] = await db
      .select()
      .from(plants)
      .where(eq(plants.name, paramsValidationResult.data.name))
      .limit(1);

    if (!existingPlant) {
      return NextResponse.json(
        {
          errors: ["Plant not found"],
        },
        { status: 404 },
      );
    }

    // Delete the plant
    await db
      .delete(plants)
      .where(eq(plants.name, paramsValidationResult.data.name));

    return new NextResponse(null, { status: 204 }); // No content
  } catch (error) {
    console.error("Error deleting plant:", error);
    return NextResponse.json(
      {
        errors: ["Failed to delete plant"],
      },
      { status: 500 },
    );
  }
}
