"use client";

import React from "react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Format date to be more readable
import { WaterRecord } from "@/app/api/plants/[name]/health/route";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const WaterTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="p-2 bg-gray-900 shadow-lg border border-purple-500">
        <p className="text-sm">{new Date(data.date).toLocaleDateString()}</p>
        <p className="text-sm text-purple-300">
          Rain: {data.rain.toFixed(2)} mm
        </p>
        <p className="text-sm text-cyan-300">
          Water Need: {data.dailyWaterNeed.toFixed(2)} mm
        </p>
        <p
          className={data.waterDeficit > 0 ? "text-red-400" : "text-green-400"}
        >
          Deficit: {data.waterDeficit.toFixed(2)} mm
        </p>
      </Card>
    );
  }
  return null;
};

// Calculate summary metrics
const calculateWaterMetrics = (data: WaterRecord[]) => {
  const totalWaterNeed = data.reduce((sum, d) => sum + d.dailyWaterNeed, 0);
  const totalRainfall = data.reduce((sum, d) => sum + d.rain, 0);
  const totalDeficit = data.reduce((sum, d) => sum + d.waterDeficit, 0);
  const daysWithRain = data.filter((d) => d.rain > 1).length;

  return {
    totalWaterNeed: totalWaterNeed.toFixed(1),
    totalRainfall: totalRainfall.toFixed(1),
    totalDeficit: totalDeficit.toFixed(1),
    daysWithRain,
    percentCovered: ((totalRainfall / totalWaterNeed) * 100).toFixed(1),
  };
};

export const WaterCharts = ({ data }: { data: WaterRecord[] }) => {
  const waterMetrics = calculateWaterMetrics(data);

  return (
    <div className="flex-1">
      <Card className="bg-gray-900 border-purple-500 text-white flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-300">
            Water Need vs Rainfall
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comparing daily water requirements with actual rainfall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  interval={2}
                  stroke="#d8b4fe"
                />
                <YAxis
                  label={{
                    value: "Water (mm)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#d8b4fe" },
                  }}
                  stroke="#d8b4fe"
                />
                <Tooltip content={<WaterTooltip />} />
                <Legend wrapperStyle={{ color: "#d8b4fe" }} />
                <Bar
                  dataKey="rain"
                  name="Rainfall"
                  fill="#a855f7"
                  barSize={20}
                />
                <Line
                  type="monotone"
                  dataKey="dailyWaterNeed"
                  name="Water Need"
                  stroke="#4DD0E1"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="waterDeficit"
                  name="Water Deficit"
                  fill="#f87171"
                  fillOpacity={0.3}
                  stroke="#f87171"
                  strokeWidth={1}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <Alert className="bg-gray-800 border-purple-500">
            <AlertCircle className="h-4 w-4 text-purple-300" />
            <AlertTitle className="text-purple-300">
              Humidity Summary
            </AlertTitle>
            <AlertDescription className="flex text-gray-200">
              Total rainfall: {waterMetrics.totalRainfall}mm , covering{" "}
              {waterMetrics.percentCovered}% of the{" "}
              {waterMetrics.totalWaterNeed}mm needed. Total deficit:{" "}
              {waterMetrics.totalDeficit}mm over the period.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>

      <Card className="bg-gray-900 border-purple-500 text-white mt-6 flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-300">Daily Water Deficit</CardTitle>
          <CardDescription>
            Tracking the gap between water needs and rainfall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  interval={2}
                  stroke="#d8b4fe"
                />
                <YAxis stroke="#d8b4fe" />
                <Tooltip content={<WaterTooltip />} />
                <Area
                  type="monotone"
                  dataKey="waterDeficit"
                  name="Water Deficit"
                  fill="#f87171"
                  stroke="#f87171"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
