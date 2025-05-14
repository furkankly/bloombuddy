"use client";

import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { HumidityRecord } from "@/app/api/plants/[name]/health/route";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const HumidityTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card className="p-2 bg-gray-900 shadow-lg border border-purple-500">
        <p className="text-sm">{new Date(data.date).toLocaleDateString()}</p>
        <p className="text-sm text-purple-300">
          Expected: {data.expectedHumidity}%
        </p>
        <p className="text-sm text-cyan-300">Actual: {data.humidity}%</p>
        <p
          className={
            data.humidityDeficit > 0 ? "text-red-400" : "text-green-400"
          }
        >
          Deficit: {data.humidityDeficit}%
        </p>
      </Card>
    );
  }
  return null;
};

const calculateHumidityMetrics = (data: HumidityRecord[]) => {
  const avgExpectedHumidity =
    data.reduce((sum, d) => sum + d.expectedHumidity, 0) / data.length;
  const avgActualHumidity =
    data.reduce((sum, d) => sum + d.humidity, 0) / data.length;
  const daysWithDeficit = data.filter((d) => d.humidityDeficit > 0).length;
  const daysWithSurplus = data.filter((d) => d.humidityDeficit < 0).length;

  return {
    avgExpectedHumidity: avgExpectedHumidity.toFixed(1),
    avgActualHumidity: avgActualHumidity.toFixed(1),
    daysWithDeficit,
    daysWithSurplus,
    averageDeficit: (avgExpectedHumidity - avgActualHumidity).toFixed(1),
  };
};

export const HumidityCharts = ({ data }: { data: HumidityRecord[] }) => {
  const humidityMetrics = calculateHumidityMetrics(data);

  return (
    <>
      <Card className="bg-gray-900 border-purple-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-300">
            Expected vs Actual Humidity
          </CardTitle>
          <CardDescription className="text-gray-300">
            Comparing expected and actual humidity levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  interval={2}
                  stroke="#d8b4fe"
                />
                <YAxis
                  label={{
                    value: "Humidity (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "#d8b4fe" },
                  }}
                  stroke="#d8b4fe"
                />
                <Tooltip content={<HumidityTooltip />} />
                <Legend wrapperStyle={{ color: "#d8b4fe" }} />
                <Bar
                  dataKey="humidity"
                  name="Humidity"
                  fill="#a855f7"
                  barSize={20}
                />
                <Line
                  type="monotone"
                  dataKey="expectedHumidity"
                  name="Expected Humidity"
                  stroke="#4DD0E1"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="humidityDeficit"
                  name="Humidity Deficit"
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
              Average expected humidity: {humidityMetrics.avgExpectedHumidity}%
              , actual: {humidityMetrics.avgActualHumidity}%. Humidity was below
              expected on {humidityMetrics.daysWithDeficit} days and above
              expected on {humidityMetrics.daysWithSurplus} days.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>

      <Card className="bg-gray-900 border-purple-500 text-white mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-purple-300">
            Humidity Deficit/Surplus
          </CardTitle>
          <CardDescription className="text-gray-300">
            Daily difference between expected and actual humidity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  interval={2}
                  stroke="#d8b4fe"
                />
                <YAxis stroke="#d8b4fe" />
                <Tooltip content={<HumidityTooltip />} />
                <defs>
                  <linearGradient
                    id="deficitGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="humidityDeficit"
                  name="Humidity Deficit"
                  fill="url(#deficitGradient)"
                  stroke="#f87171"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
