export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const siteName = "SABER HEAT";

export const siteDescription =
  "Demo funcional de SABER HEAT: monitor personal de riesgo térmico, alertas, historial y conexión BLE simulada. Next.js, shadcn/ui y Vercel.";
