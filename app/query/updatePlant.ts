import { Plant } from "../plants/page";

export async function updatePlant(plant: Plant): Promise<Plant> {
  const response = await fetch(`/api/plants/${plant.name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.join(", ") || "Failed to update plant");
  }

  return result.data.plant;
}
