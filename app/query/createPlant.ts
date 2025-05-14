import { Plant } from "../plants/page";

export async function createPlant(plant: Plant) {
  const response = await fetch("/api/plants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.join(", ") || "Failed to create plant");
  }

  return result.data.plant;
}
