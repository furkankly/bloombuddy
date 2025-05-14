import { Plant } from "../plants/page";

interface PlantsResponse {
  data?: { plants: Plant[] };
  errors?: string[];
}

export async function fetchPlants(): Promise<Plant[]> {
  const response = await fetch("/api/plants");
  const result: PlantsResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.join(", ") || "Failed to fetch plants");
  }

  return result.data?.plants || [];
}
