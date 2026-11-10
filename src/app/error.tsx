"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, RotateCcw, TriangleAlert } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
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
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <TriangleAlert className="size-8" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-destructive">
          Algo salió mal
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          No pudimos cargar esta vista
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          El error quedó registrado en la consola. Puedes reintentar o volver
          al panel.
        </p>
        {error.digest ? (
          <p className="font-mono text-[10px] text-muted-foreground">
            Digest: {error.digest}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
        >
          <Home className="size-4" />
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
