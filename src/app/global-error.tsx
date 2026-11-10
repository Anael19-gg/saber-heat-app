"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <div style={{ maxWidth: 440, padding: 24, textAlign: "center" }}>
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
          <h1
            style={{
              margin: "8px 0",
              fontSize: 28,
              lineHeight: 1.1,
            }}
          >
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
            Puede ser un deploy viejo o un chunk cacheado. Recarga la página
            para volver a intentarlo.
          </p>
          {error.digest ? (
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 10,
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              Digest: {error.digest}
            </p>
          ) : null}
          <button
            onClick={() => {
              reset();
              window.location.reload();
            }}
            style={{
              marginTop: 20,
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
        </div>
      </body>
    </html>
  );
}
