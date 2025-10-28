import React from "react";

type SkeletonVariant = "product" | "activeOrder" | "profile";

interface SkeletonProps {
  variant: SkeletonVariant;
  className?: string;
}

export default function Skeleton({ variant, className = "" }: SkeletonProps) {
  if (variant === "product") {
    return (
      <div className={`w-full flex gap-1.5 rounded-xl ${className} h-[140px]`}>
        <div className="relative w-[133px] h-[140px] flex-shrink-0 overflow-hidden bg-gray-100 rounded-xl">
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-2" />
            <div className="flex items-center gap-2 mt-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

// activeOrder
if (variant === "activeOrder") {
  return (
    <div className={`flex items-center justify-between px-4 py-3 rounded-xl bg-white border-2 border-gray-200 ${className} h-[98px]`}>
      <div className="flex-1">
        <div className="flex flex-col gap-1 rounded-xl">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
    </div>
  );
}

// profile
return (
  <div className={`w-full ${className}`}>
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col mt-6 gap-4 w-full">
        <div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);
}


