"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type BladeVisualProps = {
  className?: string;
  compact?: boolean;
};

export function BladeVisual({ className, compact = false }: BladeVisualProps) {
  const rawId = useId().replace(/:/g, "");
  const bladeId = `blade-${rawId}`;
  const glowId = `glow-${rawId}`;
  const hiltId = `hilt-${rawId}`;

  return (
    <svg
      viewBox="0 0 160 420"
      fill="none"
      aria-hidden="true"
      className={cn("blade-glow", className)}
      style={{ color: "var(--zone-color, var(--primary))" }}
    >
      <defs>
        <linearGradient id={bladeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="0.35" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#f8fafc" />
          <stop offset="0.65" stopColor="currentColor" stopOpacity="0.85" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={hiltId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#020617" />
          <stop offset="0.2" stopColor="#334155" />
          <stop offset="0.45" stopColor="#94a3b8" />
          <stop offset="0.6" stopColor="#475569" />
          <stop offset="0.85" stopColor="#1e293b" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="80" cy="392" rx="48" ry="9" fill="#020617" opacity="0.65" />
      <rect
        x="56"
        y="16"
        width="48"
        height={compact ? 196 : 228}
        rx="24"
        fill="currentColor"
        opacity="0.16"
        filter={`url(#${glowId})`}
      />
      <rect
        x="64"
        y={compact ? 22 : 26}
        width="32"
        height={compact ? 190 : 220}
        rx="16"
        fill={`url(#${bladeId})`}
      />
      <rect
        x="74"
        y={compact ? 30 : 34}
        width="12"
        height={compact ? 174 : 202}
        rx="6"
        fill="#f8fafc"
        opacity="0.85"
      />

      <rect
        x="48"
        y={compact ? 218 : 252}
        width="64"
        height="26"
        rx="8"
        fill={`url(#${hiltId})`}
        stroke="#64748b"
      />
      <rect
        x="52"
        y={compact ? 226 : 260}
        width="56"
        height="5"
        rx="2.5"
        fill="currentColor"
        opacity="0.9"
      />
      <rect
        x="48"
        y={compact ? 242 : 276}
        width="64"
        height="6"
        rx="3"
        fill="currentColor"
      />

      <rect
        x="52"
        y={compact ? 248 : 282}
        width="56"
        height={compact ? 96 : 96}
        rx="10"
        fill={`url(#${hiltId})`}
        stroke="#334155"
      />
      <rect
        x="64"
        y={compact ? 258 : 292}
        width="32"
        height="20"
        rx="3"
        fill="#020617"
        stroke="#0ea5e9"
        strokeWidth="1.5"
      />
      <text
        x="80"
        y={compact ? 272 : 306}
        textAnchor="middle"
        fill="#67e8f9"
        fontFamily="monospace"
        fontSize="7"
        fontWeight="700"
      >
        28.4
      </text>
      <circle
        cx="80"
        cy={compact ? 288 : 322}
        r="4"
        fill="#f97316"
        stroke="#7c2d12"
        strokeWidth="1.5"
      />
      <g stroke="#475569" strokeWidth="1.5">
        <line x1="58" y1={compact ? 300 : 334} x2="102" y2={compact ? 300 : 334} />
        <line x1="58" y1={compact ? 308 : 342} x2="102" y2={compact ? 308 : 342} />
        <line x1="58" y1={compact ? 316 : 350} x2="102" y2={compact ? 316 : 350} />
        <line x1="58" y1={compact ? 324 : 358} x2="102" y2={compact ? 324 : 358} />
      </g>
      <rect
        x="52"
        y={compact ? 344 : 378}
        width="56"
        height="18"
        rx="6"
        fill={`url(#${hiltId})`}
        stroke="#64748b"
      />
      <rect
        x="72"
        y={compact ? 349 : 383}
        width="16"
        height="5"
        rx="2.5"
        fill="#020617"
      />
      <circle
        cx="80"
        cy={compact ? 356 : 390}
        r="2.5"
        fill="#020617"
        stroke="#94a3b8"
      />
    </svg>
  );
}
