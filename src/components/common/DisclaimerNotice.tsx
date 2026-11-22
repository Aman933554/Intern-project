import React from "react";
import { Info } from "lucide-react";

interface DisclaimerNoticeProps {
  className?: string;
  variant?: "inline" | "banner";
}

export const DisclaimerNotice: React.FC<DisclaimerNoticeProps> = ({
  className = "",
  variant = "inline",
}) => {
  return (
    <div
      className={`rounded-lg border border-surface-300 bg-surface-100/80 p-3 text-xs text-gray-400 flex items-start gap-2.5 ${className}`}
    >
      <Info className="w-4 h-4 text-electric-blue shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-gray-200">Data Integrity Notice: </span>
        All pricing and benchmark figures are curated reference samples derived from public technical reports, provider documentation, and standardized evals. They are intended for architectural planning and comparative discovery.
      </div>
    </div>
  );
};
