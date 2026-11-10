"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export function SaberHeatLogo({ className }: { className?: string }) {
  const rawId = useId().replace(/:/g, "");
  const bladeId = `saber-blade-${rawId}`;
  const hiltId = `saber-hilt-${rawId}`;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient
          id={bladeId}
          x1="20"
          y1="2"
          x2="20"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f0f9ff" />
          <stop offset="0.45" stopColor="#67e8f9" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient
          id={hiltId}
          x1="13"
          y1="24"
          x2="28"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#64748b" />
          <stop offset="0.45" stopColor="#1e293b" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
      </defs>
      <rect x="17.5" y="2" width="5" height="21" rx="2.5" fill={`url(#${bladeId})`} />
      <rect x="13" y="23" width="14" height="4" rx="2" fill="#f97316" />
      <rect
        x="14.5"
        y="27"
        width="11"
        height="10"
        rx="2.5"
        fill={`url(#${hiltId})`}
        stroke="#334155"
      />
      <circle cx="20" cy="32" r="1.2" fill="#67e8f9" />
    </svg>
  );
}
