export interface WeatherApiResponse {
  // Location data
  latitude: number;
  longitude: number;

  // Metadata
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;

  // Units for daily data
  daily_units?: DailyUnits;

  // The actual daily data
  daily?: DailyData;

  error?: boolean;
  reason?: string;
}

/**
 * Units used for the daily measurements
 */
export interface DailyUnits {
  time: string; // Format of time values (e.g., "iso8601")
  rain_sum: string; // Unit for rain_sum (e.g., "mm")
}

/**
 * The daily weather measurements
 */
export interface DailyData {
  time: string[]; // Array of timestamps in ISO8601 format
  rain_sum: number[]; // Array of rain measurements
  relative_humidity_2m_mean: number[]; // Unit for humidity (e.g., "%")
}
