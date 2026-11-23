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
    blue: "text-electric-blue bg-electric-blue/10 border-electric-blue/20",
    violet: "text-violet bg-violet/10 border-violet/20",
    emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };

  return (
    <div className="bg-card border border-surface-300 rounded-xl p-5 hover:border-gray-700 transition-all glow-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${colorMap[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white font-mono mb-1">
        {value}
      </div>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
};
