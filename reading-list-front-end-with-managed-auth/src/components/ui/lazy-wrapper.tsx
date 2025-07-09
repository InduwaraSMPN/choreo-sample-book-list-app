import React, { Suspense } from "react";

import { cn } from "@/lib/utils";

import { LoadingSpinner } from "./loading-spinner";

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function LazyWrapper({ children, fallback, className }: LazyWrapperProps) {
  const defaultFallback = (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <LoadingSpinner size="lg" />
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}
