"use client";

import { BellOff, CheckCheck } from "lucide-react";

import { AlertItem } from "@/components/alerts/alert-item";
import { PageHeader } from "@/components/page-header";
import { useSaberHeat } from "@/components/providers";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AlertsPage() {
  const {
    alerts,
    settings,
    acknowledgeAlert,
    acknowledgeAll,
    unacknowledgedCount,
  } = useSaberHeat();

  const pending = alerts.filter((alert) => !alert.acknowledged);
  const acknowledged = alerts.filter((alert) => alert.acknowledged);

  const renderList = (items: typeof alerts) => {
    if (items.length === 0) {
      return (
        <Empty className="border-border/60 bg-card/40 py-12">
          <EmptyMedia variant="icon">
            <BellOff />
          </EmptyMedia>
          <EmptyTitle>Sin alertas en esta vista</EmptyTitle>
          <EmptyDescription>
            Cuando el índice de calor cruce un umbral, la alerta aparecerá
            aquí.
          </EmptyDescription>
        </Empty>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {items.map((alert) => (
          <AlertItem
            key={alert.id}
            alert={alert}
            unit={settings.unit}
            onAcknowledge={acknowledgeAlert}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Alertas"
        description="Tus alertas y reconocimientos."
      >
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border/70 bg-card/60"
          onClick={acknowledgeAll}
          disabled={unacknowledgedCount === 0}
        >
          <CheckCheck className="size-3.5" />
          Reconocer todas
        </Button>
      </PageHeader>



      <Tabs defaultValue="all" className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-medium">Registro de eventos</h2>
            <p className="text-xs text-muted-foreground">
              Las alertas se generan cuando el índice de calor cruza un umbral.
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="all">Todas ({alerts.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Sin reconocer ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="acknowledged">
              Reconocidas ({acknowledged.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all">{renderList(alerts)}</TabsContent>
        <TabsContent value="pending">{renderList(pending)}</TabsContent>
        <TabsContent value="acknowledged">
          {renderList(acknowledged)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
