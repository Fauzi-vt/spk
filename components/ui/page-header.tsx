import type React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-800 mb-2">{title}</h1>
          <p className="text-sm md:text-base text-neutral-600">{description}</p>
        </div>
        {children && <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">{children}</div>}
      </div>
    </div>
  );
}
