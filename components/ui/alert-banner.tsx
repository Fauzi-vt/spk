import { Alert, AlertDescription } from "@/components/ui/alert";
import type { LucideIcon } from "lucide-react";

interface AlertBannerProps {
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  icon: LucideIcon;
}

export function AlertBanner({ type, title, description, icon: Icon }: AlertBannerProps) {
  const variants = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    warning: "bg-orange-50 border-orange-200 text-orange-700",
    error: "bg-red-50 border-red-200 text-red-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <Alert className={variants[type]}>
      <Icon className="h-4 w-4" />
      <AlertDescription>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-current rounded-full"></div>
          <p className="font-medium">{title}</p>
        </div>
        <p className="mt-1">{description}</p>
      </AlertDescription>
    </Alert>
  );
}
