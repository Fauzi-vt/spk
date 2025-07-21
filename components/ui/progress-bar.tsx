interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: "indigo" | "emerald" | "orange" | "red";
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, className = "", color = "indigo", showLabel = false, label }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-600",
    orange: "bg-orange-600",
    red: "bg-red-600",
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-neutral-600 mb-1">
          <span>{label}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
