"use client";

import { useEffect, useState } from "react";

const buttonStyle: React.CSSProperties = {
  border: "1px solid #334155",
  borderRadius: 10,
  padding: "9px 14px",
  background: "#0f172a",
  color: "#e2e8f0",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [health, setHealth] = useState("");
  const [copyState, setCopyState] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const details = [
    error.message || String(error),
    error.digest ? `Digest: ${error.digest}` : "",
    error.stack ? error.stack.slice(0, 1600) : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const testHealth = async () => {
    setChecking(true);
    setHealth("Probando /api/health…");

    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const text = await response.text();
      setHealth(`HTTP ${response.status} · ${text.slice(0, 180)}`);
    } catch (caught) {
      setHealth(
        `Error de red: ${
          caught instanceof Error ? caught.message : String(caught)
        }`,
      );
    } finally {
      setChecking(false);
    }
  };

  const copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(details);
      setCopyState("Copiado");
    } catch {
      setCopyState("No se pudo copiar; usa el texto de detalles");
    }
  };

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b1220",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 560, padding: 24, textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 16px",
              borderRadius: 16,
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            !
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#f87171",
              fontWeight: 700,
            }}
          >
            Error global
          </p>
          <h1 style={{ margin: "8px 0", fontSize: 28, lineHeight: 1.1 }}>
            La consola no pudo cargar
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.5,
              color: "#94a3b8",
            }}
          >
            El HTML cargó, pero un chunk de JavaScript o el layout raíz falló.
            No es un problema de Neon: si la base falla, la app cae a modo
            local. Prueba en incógnito o con datos móviles para descartar la
            red de la universidad.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginTop: 18,
            }}
          >
            <button
              onClick={() => setShowDetails((current) => !current)}
              style={buttonStyle}
            >
              {showDetails ? "Ocultar detalles" : "Ver detalles"}
            </button>
            <button
              onClick={testHealth}
              disabled={checking}
              style={{ ...buttonStyle, opacity: checking ? 0.6 : 1 }}
            >
              Probar /api/health
            </button>
            <button onClick={copyDetails} style={buttonStyle}>
              Copiar detalles
            </button>
          </div>

          {health ? (
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 11,
                lineHeight: 1.5,
                color: "#94a3b8",
                fontFamily: "monospace",
                wordBreak: "break-word",
              }}
            >
              {health}
            </p>
          ) : null}

          {copyState ? (
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#67e8f9" }}>
              {copyState}
            </p>
          ) : null}

          {showDetails ? (
            <pre
              style={{
                margin: "14px 0 0",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#020617",
                color: "#cbd5e1",
                fontSize: 11,
                lineHeight: 1.5,
                textAlign: "left",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 220,
                overflow: "auto",
              }}
            >
              {details}
            </pre>
          ) : null}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <button
              onClick={() => {
                reset();
                window.location.reload();
              }}
              style={{
                border: 0,
                borderRadius: 10,
                padding: "10px 18px",
                background: "#f97316",
                color: "#0b1220",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Recargar consola
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload is intentional in the global error boundary */}
            <a
              href="/"
              style={{
                borderRadius: 10,
                padding: "10px 18px",
                border: "1px solid #334155",
                color: "#e2e8f0",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Volver al inicio
            </a>
          </div>

          <p style={{ margin: "16px 0 0", fontSize: 11, color: "#64748b" }}>
            Si con datos móviles funciona y con el Wi-Fi de la universidad no,
            el bloqueo es de la red. Si falla en todos lados, es un deploy viejo
            o un chunk cacheado: redeploy y hard refresh.
          </p>
        </div>
      </body>
    </html>
  );
}
