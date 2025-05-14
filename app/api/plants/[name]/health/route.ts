import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { plants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WeatherApiResponse } from "../../../weatherApiTypes";
import { Plant } from "@/app/plants/page";

const ParamsSchema = z.object({
  name: z.string().min(1),
});

const QuerySchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Start date must be in YYYY-MM-DD format",
      })
      .refine((date) => !isNaN(new Date(date).getTime()), {
        message: "Start date must be a valid date",
      }),

    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "End date must be in YYYY-MM-DD format",
      })
      .refine((date) => !isNaN(new Date(date).getTime()), {
        message: "End date must be a valid date",
      }),

    filter: z.enum(["water", "humidity"], {
      errorMap: () => ({
        message: "Filter must be either 'water' or 'humidity'",
      }),
    }),
    latitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "Latitude must be a valid number",
    }),
    longitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: "Longitude must be a valid number",
    }),
  })
  .refine(
    (data) => {
      // Additional validation to ensure endDate is not before startDate
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end >= start;
    },
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    },
  );

export interface DailyRecord {
  date: string;
  rain: number;
  dailyWaterNeed: number;
  waterDeficit: number;
  humidity: number;
  expectedHumidity: number;
  humidityDeficit: number;
}

export type WaterRecord = {
  date: string;
  rain: number;
  dailyWaterNeed: number;
  waterDeficit: number;
};

export type HumidityRecord = {
  date: string;
  humidity: number;
  expectedHumidity: number;
  humidityDeficit: number;
};

function formatWeatherData(
  data: WeatherApiResponse,
  existingPlant: Plant,
  filter: "water" | "humidity",
): WaterRecord[] | HumidityRecord[] | [] {
  if (filter === "water") {
    if (!data || !data.daily?.time || !data.daily?.rain_sum) {
      return [];
    } else {
      const dailyData = data.daily?.time.map((time, index) => {
        return {
          dateTime: time,
          date: time.split("T")[0],
          hour: time.split("T")[1],
          rain:
            filter === "water" ? (data.daily?.rain_sum[index] ?? 0) : undefined,
        };
      });

      return dailyData.map((day): WaterRecord => {
        const dailyWaterNeed = existingPlant.weeklyWaterNeed / 7;
        const waterDeficit = Math.max(0, dailyWaterNeed - (day.rain ?? 0));

        return {
          date: day.date,
          rain: day.rain ?? 0,
          dailyWaterNeed,
          waterDeficit,
        };
      });
    }
  } else {
    if (!data || !data.daily?.time || !data.daily?.relative_humidity_2m_mean) {
      return [];
    } else {
      const dailyData = data.daily?.time.map((time, index) => {
        return {
          dateTime: time,
          date: time.split("T")[0],
          hour: time.split("T")[1],
          humidity:
            filter === "humidity"
              ? (data.daily?.relative_humidity_2m_mean[index] ?? 0)
              : undefined,
        };
      });

      return dailyData.map((day): HumidityRecord => {
        const humidityDeficit = Math.max(
          0,
          existingPlant.expectedHumidity - (day.humidity ?? 0),
        );

        return {
          date: day.date,
          humidity: day.humidity ?? 0,
          expectedHumidity: existingPlant.expectedHumidity,
          humidityDeficit,
        };
      });
    }
  }
}

export async function GET(
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

    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    const { startDate, endDate, latitude, longitude, filter } =
      QuerySchema.parse(queryParams);

    // Get plant properties
    const [existingPlant] = await db
      .select()
      .from(plants)
      .where(eq(plants.name, paramsValidationResult.data.name))
      .limit(1);

    const weatherApiUrl = `https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&timezone=auto`;

    const parsedWeatherApiUrl = new URL(weatherApiUrl);

    if (filter === "water") {
      parsedWeatherApiUrl.searchParams.append("daily", "rain_sum");
    } else {
      parsedWeatherApiUrl.searchParams.append(
        "daily",
        "relative_humidity_2m_mean",
      );
    }

    const response = await fetch(parsedWeatherApiUrl);
    const result: WeatherApiResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          errors: [`Historic Forecast API error: ${result.reason as string}`],
        },
        { status: response.status },
      );
    } else {
      const data = formatWeatherData(result, existingPlant, filter);
      return NextResponse.json(
        {
          data,
        },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        errors: ["Internal server error"],
      },
      { status: 500 },
    );
  }
}
