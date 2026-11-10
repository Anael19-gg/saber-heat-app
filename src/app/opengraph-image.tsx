import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";

export const alt = "SABER HEAT — Monitor personal de riesgo térmico";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1220",
          color: "#f8fafc",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -100,
            width: 460,
            height: 460,
            borderRadius: "9999px",
            backgroundImage:
              "linear-gradient(135deg, rgba(34,211,238,0.35), rgba(11,18,32,0))",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#67e8f9",
            fontSize: 22,
            letterSpacing: 5,
            fontWeight: 700,
          }}
        >
          {siteName} · IOT / IOE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -4,
            }}
          >
            <span>Tu calor,</span>
            <span style={{ color: "#f97316" }}>en color.</span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 780,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#94a3b8",
            }}
          >
            Monitor personal de riesgo térmico con forma de sable de energía.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1e3a5f",
            paddingTop: 24,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          <span>Next.js 16 · shadcn/ui · Vercel</span>
          <span>Demo funcional</span>
        </div>
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 96,
            width: 18,
            height: 300,
            borderRadius: 9,
            backgroundImage:
              "linear-gradient(180deg, #f8fafc, #67e8f9, #0891b2)",
            boxShadow: "0 0 60px #22d3ee",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
