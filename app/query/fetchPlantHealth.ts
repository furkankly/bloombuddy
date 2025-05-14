import {
  HumidityRecord,
  WaterRecord,
} from "@/app/api/plants/[name]/health/route";

export type Filter = "water" | "humidity";

interface QueryParams {
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  filter: Filter;
}

interface PlantHealthResponse {
  data?: WaterRecord[] | HumidityRecord[] | [];
  errors?: string[];
}

// Fetch function for plant health data
export async function fetchPlantHealth(
  plantName: string,
  params: QueryParams,
): Promise<WaterRecord[] | HumidityRecord[] | []> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
    filter: params.filter,
  });

  const response = await fetch(
    `/api/plants/${plantName}/health?${queryParams.toString()}`,
  );

  const result: PlantHealthResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      result.errors?.join(", ") || "Failed to fetch the plant health",
    );
  }

  return result.data ?? [];
}
