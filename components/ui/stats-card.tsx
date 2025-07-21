import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "orange" | "purple" | "red" | "blue";
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, color = "indigo", description }: StatsCardProps) {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
  };

  const valueColorClasses = {
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-neutral-600">{title}</p>
            <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>{value}</p>
            {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
