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

interface RankingsChartProps {
  data: {
    modelName: string;
    score: number;
    benchmarkName: string;
    unit: string;
  }[];
}

export const RankingsChart: React.FC<RankingsChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data.slice(0, 8)}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis
            type="number"
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#1F2937" }}
          />
          <YAxis
            type="category"
            dataKey="modelName"
            stroke="#9CA3AF"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#1F2937" }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#1F2937",
              borderRadius: "8px",
              color: "#F3F4F6",
              fontSize: "12px",
            }}
            formatter={(value: any, name: any, item: any) => [
              `${value} ${item.payload.unit}`,
              item.payload.benchmarkName,
            ]}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.slice(0, 8).map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? "#F59E0B" : index === 1 ? "#3B82F6" : "#8B5CF6"}
                fillOpacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
