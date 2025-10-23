"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// ----- utils -----
function cx(...s: (string | false | null | undefined)[]) {
  return s.filter(Boolean).join(" ");
}

// ----- mock data for chart -----
type Point = { label: string; value: number };

const data7: Point[] = [
  { label: "Jun 24", value: 120 },
  { label: "Jun 25", value: 80 },
  { label: "Jun 26", value: 140 },
  { label: "Jun 27", value: 200 },
  { label: "Jun 28", value: 95 },
  { label: "Jun 29", value: 130 },
  { label: "Jun 30", value: 260 },
];

const data30 = Array.from({ length: 30 }).map((_, i) => ({
  label: `Jun ${i + 1}`,
  value: Math.round(80 + Math.sin(i / 4) * 60 + (i % 6) * 8),
}));

const data3m = Array.from({ length: 12 }).map((_, i) => ({
  label: `W${i + 1}`,
  value: Math.round(200 + Math.sin(i / 2) * 120 + (i % 3) * 30),
}));

type RangeKey = "3m" | "30d" | "7d";
const rangeMap: Record<RangeKey, { label: string; data: Point[] }> = {
  "3m": { label: "Last 3 months", data: data3m },
  "30d": { label: "Last 30 days", data: data30 },
  "7d": { label: "Last 7 days", data: data7 },
};

// ----- small UI pieces -----
function DeltaChip({ delta }: { delta: number }) {
  const isUp = delta >= 0;
  return (
    <Badge
      variant="outline"
      className={cx(
        "rounded-full gap-1 px-2 py-0.5 text-xs border",
        isUp ? "border-emerald-200 text-emerald-700" : "border-rose-200 text-rose-700"
      )}
    >
      {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
      {isUp ? `+${delta}%` : `${delta}%`}
    </Badge>
  );
}

function StatCard(props: {
  title: string;
  value: string | number;
  delta: number;
  captionTitle: string;
  captionDesc: string;
}) {
  const up = props.delta >= 0;
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardDescription className="text-sm">{props.title}</CardDescription>
        <DeltaChip delta={props.delta} />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-semibold tracking-tight">
          {props.value}
        </div>
        <div className="text-sm text-slate-700 flex items-center gap-1">
          {up ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {props.captionTitle}
        </div>
        <div className="text-slate-500 text-sm">{props.captionDesc}</div>
      </CardContent>
    </Card>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-md border bg-white px-2.5 py-1.5 text-xs shadow-sm">
      <div className="font-medium">{p.payload.label}</div>
      <div className="text-slate-600">{p.value}</div>
    </div>
  );
}

// ----- main component -----
export default function Dashboard() {
  const [range, setRange] = React.useState<RangeKey>("3m");
  const chartData = rangeMap[range].data;

  return (
    <div className="space-y-6 p-4">
      {/* top stats grid (3 cards) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Projects"
          value={128}
          delta={12.5}
          captionTitle="Trending up this month"
          captionDesc="Projects created in recent period"
        />
        <StatCard
          title="Products"
          value={56}
          delta={-3.2}
          captionTitle="Slight dip this period"
          captionDesc="Catalog changes & additions"
        />
        <StatCard
          title="Users"
          value={40}
          delta={4.5}
          captionTitle="Active user growth"
          captionDesc="Engagement remains stable"
        />
      </div>

      {/* visitors chart card */}
      <Card className="rounded-2xl border-slate-200">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-[17px]">Total Visitors</CardTitle>
            <CardDescription>Total for the selected range</CardDescription>
          </div>

          <div className="flex gap-2">
            {(
              [
                ["3m", "Last 3 months"],
                ["30d", "Last 30 days"],
                ["7d", "Last 7 days"],
              ] as [RangeKey, string][]
            ).map(([key, label]) => (
              <Button
                key={key}
                size="sm"
                variant={range === key ? "default" : "outline"}
                className={cx(
                  "rounded-md",
                  range === key
                    ? "bg-slate-900 text-white hover:bg-slate-900"
                    : "bg-white"
                )}
                onClick={() => setRange(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="h-[320px] w-full rounded-xl border bg-white p-4 sm:p-6">
            {/* gradient defs */}
            <svg width="0" height="0">
              <defs>
                <linearGradient id="fillGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
            </svg>

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, left: 10, right: 10, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={8}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={35}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#fillGradient)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
