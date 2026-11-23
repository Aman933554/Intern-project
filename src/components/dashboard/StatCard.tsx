import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  accentColor?: "blue" | "violet" | "emerald" | "amber";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = "blue",
}) => {
  const colorMap = {
    blue: "text-electric-blue bg-electric-blue/15 border-electric-blue/30 shadow-[0_0_15px_rgba(14,165,233,0.25)]",
    violet: "text-violet bg-violet/15 border-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.25)]",
    emerald: "text-emerald-400 bg-emerald-400/15 border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]",
    amber: "text-amber-400 bg-amber-400/15 border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]",
  };

  return (
    <div className="bg-card/90 backdrop-blur-md border border-surface-300/80 rounded-2xl p-5 hover:border-surface-400 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5 group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${colorMap[accentColor]} transition-transform group-hover:scale-110`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white font-mono mb-1 tracking-tight">
        {value}
      </div>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
};
