"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface PricingOverviewChartProps {
  data: {
    range: string;
    count: number;
  }[];
}

export const PricingOverviewChart: React.FC<PricingOverviewChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-500">
        No pricing distribution available
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis
            dataKey="range"
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#1F2937" }}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#1F2937" }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#1F2937",
              borderRadius: "8px",
              color: "#F3F4F6",
              fontSize: "12px",
            }}
            formatter={(value: any) => [`${value} Models`, "Volume"]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`bar-${index}`}
                fill={index === 0 ? "#10B981" : "#3B82F6"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
