import type React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
      <p className="text-neutral-500 mb-2">{title}</p>
      <p className="text-sm text-neutral-400 mb-4">{description}</p>
      {action}
    </div>
  );
}
