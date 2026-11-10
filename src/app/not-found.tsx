import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { SaberHeatLogo } from "@/components/saber-heat-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <SaberHeatLogo className="size-10" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          Error 404
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Esta ruta no existe
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          La página que buscas no forma parte de la consola de SABER HEAT.
          Vuelve al panel para seguir monitoreando.
        </p>
      </div>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "default" }), "gap-2")}
      >
        <ArrowLeft className="size-4" />
        Volver al panel
      </Link>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <Compass className="size-3" />
        SABER HEAT · 404
      </div>
    </div>
  );
}
