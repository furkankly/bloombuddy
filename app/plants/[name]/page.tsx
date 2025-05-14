"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { CalendarIcon, Droplet, Droplets } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { fetchPlantHealth, Filter } from "@/app/query/fetchPlantHealth";
import { WaterCharts } from "./charts/water";
import { HumidityCharts } from "./charts/humidity";
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./worldmap"), {
  ssr: false,
});

import {
  HumidityRecord,
  WaterRecord,
} from "@/app/api/plants/[name]/health/route";

export default function PlantHealthDashboard() {
  const params = useParams<{ name: string }>();
  const plantName = decodeURIComponent(params.name as string);

  const [filter, setFilter] = useState<Filter>("water");

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  useEffect(() => {
    // Get current user position when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: Number.parseFloat(position.coords.latitude.toFixed(6)),
            lng: Number.parseFloat(position.coords.longitude.toFixed(6)),
          });
        },
        (error) => {
          console.error("Error getting current position:", error.message);
          // Fallback to a default position if needed
          // setCoordinates({ lat: 20, lng: 0 });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } else {
      console.error("Geolocation is not supported by your browser");
      // Fallback to a default position
      // setCoordinates({ lat: 20, lng: 0 });
    }
  }, []);

  // Format dates for API
  const formatDateForApi = (date: Date) => format(date, "yyyy-MM-dd");

  // Prepare date range for API
  const dateRange = {
    startDate: date?.from
      ? formatDateForApi(date.from)
      : formatDateForApi(subDays(new Date(), 7)),
    endDate: date?.to
      ? formatDateForApi(date.to)
      : formatDateForApi(new Date()),
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "plantHealth",
      plantName,
      filter,
      dateRange,
      coordinates.lat,
      coordinates.lng,
    ],
    queryFn: () =>
      fetchPlantHealth(plantName, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        filter,
      }),
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Health Analysis for {plantName.toLocaleLowerCase()}
          </h1>
          <p className="text-muted-foreground">
            Monitor your plant&apos;s water and humidity needs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild className="hover:cursor-pointer">
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[1000]" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="w-full space-y-6">
        <Tabs
          value={filter}
          onValueChange={(value) => setFilter(value as Filter)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="water"
              className="flex items-center gap-4 hover:cursor-pointer"
            >
              <Droplets className="h-4 w-4" />
              Water Analysis
            </TabsTrigger>
            <TabsTrigger
              value="humidity"
              className="flex items-center gap-4 hover:cursor-pointer"
            >
              <Droplet className="h-4 w-4" />
              Humidity Analysis
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-8 justify-items-center mt-8">
            {isLoading ? (
              <div className="flex-1">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent>
                      <Skeleton className="h-100 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : isError ? (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-destructive">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load data"}
                  </p>
                </CardContent>
              </Card>
            ) : data ? (
              <div className="flex-1">
                <TabsContent value="water" className="flex-1">
                  {<WaterCharts data={data as WaterRecord[]} />}
                </TabsContent>
                <TabsContent value="humidity" className="space-y-4">
                  {<HumidityCharts data={data as HumidityRecord[]} />}
                </TabsContent>
              </div>
            ) : (
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>No Data Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No data available for the selected time period.</p>
                </CardContent>
              </Card>
            )}
            <div className="max-w-[500]">
              <h1 className="text-3xl font-bold mb-4 text-purple-300">
                Interactive World Map
              </h1>
              <p className="mb-6 text-purple-100 break-words">
                Click anywhere on the map to get latitude and longitude
                coordinates of where you want your plants to bloom.
              </p>
              <WorldMap
                coordinates={coordinates}
                setCoordinates={setCoordinates}
              />
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
