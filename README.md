# SABER HEAT — Demo de la PWA

Diseño preliminar y **funcional** de la consola de **SABER HEAT**, un monitor personal de riesgo térmico con forma de sable de energía. Esta demo simula el dispositivo, las lecturas, las alertas y el emparejamiento BLE. **No necesita base de datos ni hardware.**

![Panel de control](public/screens/dashboard.png)

## Qué incluye

- **Panel de control** con temperatura, sensación térmica, humedad, UV, batería y estado de la zona.
- **Simulación en vivo** cada 3.5 s con cuatro escenarios: obra al sol, running, salón y casa.
- **Cálculo del índice de calor** con la fórmula de Rothfusz y umbrales configurables.
- **Sable animado** que cambia de color según la zona: azul, verde, ámbar, rojo y rojo intermitente.
- **Alertas** con reconocimiento, filtros y trazabilidad.
- **Historial** de sesión y resumen de 7 días, con exportación a CSV.
- **Dispositivo** con estado de conexión, batería, señal, sensores, firmware y modo demo.
- **Emparejamiento BLE simulado** en tres pasos, con código de 6 dígitos.
- **Ajustes** de umbrales, unidades (°C/°F), hidratación, notificaciones, sonido, vibración y contacto de emergencia.
- **Persistencia local** de ajustes e hidratación con `localStorage`.
- **Interfaz responsive** con sidebar colapsable, tema oscuro y estética sci-fi.

## Stack

- [Next.js 16](https://nextjs.org/) con App Router y Turbopack
- [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) con Base UI
- [Recharts](https://recharts.org/) para las gráficas
- [Lucide](https://lucide.dev/) para los iconos
- [Sonner](https://sonner.emilkowal.ski/) para los toasts

## Cómo correr

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para compilar:

```bash
npm run build
npm start
```

## Capturas

### Dispositivo y emparejamiento

![Dispositivo](public/screens/dispositivo.png)

| Paso 1 | Paso 3 | Conectado |
| --- | --- | --- |
| ![Paso 1](public/screens/emparejamiento-paso-1.png) | ![Paso 3](public/screens/emparejamiento-paso-3.png) | ![Conectado](public/screens/emparejamiento-conectado.png) |

### Historial y alertas

![Historial](public/screens/historial.png)

![Resumen de 7 días](public/screens/historial-7dias.png)

![Alertas](public/screens/alertas.png)

### Ajustes y estado extremo

![Ajustes](public/screens/ajustes.png)

![Estado extremo](public/screens/estado-extremo.png)

## Estructura del proyecto

```text
src/
  app/
    page.tsx                 # Panel de control
    historial/page.tsx       # Historial de sesión y 7 días
    alertas/page.tsx         # Alertas y reconocimientos
    dispositivo/page.tsx     # Estado, sensores y escenarios
    ajustes/page.tsx         # Umbrales y preferencias
    globals.css              # Tema, tokens y utilidades
    layout.tsx               # Layout raíz con sidebar
  components/
    app-sidebar.tsx
    app-header.tsx
    providers.tsx            # Estado global y simulación
    pairing-dialog.tsx
    blade-visual.tsx
    dashboard/
    alerts/
    ui/                      # Componentes de shadcn/ui
  lib/
    saber-heat.ts            # Tipos, umbrales, fórmula y datos mock
```

## Cómo probar la demo

1. Abre el **Panel** y observa cómo cambian las lecturas cada 3.5 s.
2. Cambia el escenario en el selector del header: **Obra al sol**, **Running**, **Salón** o **Casa**.
3. Pulsa **Simular peligro** para forzar una alerta extrema.
4. Pulsa **Reconocer alerta** o entra a **Alertas** para reconocer eventos.
5. Registra agua con **+250 ml** o **+500 ml**.
6. Ve a **Dispositivo** y prueba **Reemparejar**: el flujo BLE está simulado en tres pasos.
7. En **Historial**, cambia entre **Sesión** y **7 días** y exporta el CSV.
8. En **Ajustes**, mueve los umbrales y cambia la unidad a Fahrenheit.

## Notas y limitaciones

- **No hay base de datos.** Todo el estado vive en el cliente y se pierde si borras el storage del navegador.
- **No hay Bluetooth real.** El diálogo de emparejamiento simula el flujo; el producto final usaría `Web Bluetooth` en Android y una app nativa o modo Wi-Fi en iOS.
- **Los datos son simulados.** La fórmula del índice de calor es real, pero las lecturas no vienen de un sensor físico.
- **Es un diseño preliminar.** No incluye autenticación, backend, PWA instalable ni notificaciones push reales.
- **No es un dispositivo médico.** El producto real debe evitar claims de diagnóstico y cumplir la normativa aplicable (NOM-015-STPS, LFPDPPP/LGPDPPSO, COFEPRIS, IFT, PROFECO).
- **Los umbrales** se configuran en °C; la vista convierte a °F.

## Roadmap

- [ ] Conectar `Web Bluetooth` real y el servicio GATT del ESP32-C3.
- [ ] Backend en Vercel + Neon para historial multisesión.
- [ ] `manifest.json` + service worker para PWA instalable y offline.
- [ ] Web Push con VAPID para alertas al contacto de emergencia.
- [ ] Autenticación y multi-dispositivo.
- [ ] Tests E2E con Playwright.
- [ ] Deploy en Vercel.

## Créditos

Diseño, código y datos simulados: Anael. Inspirado en la estética de la ciencia ficción; no usa marcas registradas de Star Wars.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
