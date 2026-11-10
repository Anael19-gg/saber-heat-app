# SABER HEAT — Demo de la PWA

Diseño preliminar y **funcional** de la consola de **SABER HEAT**, un monitor personal de riesgo térmico con forma de sable de energía. Esta demo simula el dispositivo, las lecturas, las alertas y el emparejamiento BLE. **No necesita base de datos ni hardware.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anael19-gg/saber-heat-app)

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

## Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Anael19-gg/saber-heat-app)

### Opción A · Dashboard (recomendada)

1. Entra a [vercel.com/new](https://vercel.com/new).
2. Importa el repositorio `Anael19-gg/saber-heat-app`.
3. Vercel detecta **Next.js** automáticamente. Deja los valores por defecto:
   - Framework Preset: **Next.js**
   - Root Directory: **./**
   - Build Command: **next build**
   - Output Directory: **.next**
4. No necesitas variables de entorno. Opcional: define `NEXT_PUBLIC_SITE_URL` con tu dominio final.
5. Pulsa **Deploy**.

Cada push a `main` despliega producción; cada PR genera un preview automático.

### Opción B · CLI

```bash
npm i -g vercel
vercel login
cd C:\Users\Anael\.t3\projects\ideas\saber-heat-app
vercel
vercel --prod
```

> En Windows, la CLI puede necesitar **Modo desarrollador** para crear los symlinks de su caché. Si aparece `EPERM: operation not permitted, symlink`, usa la opción A (dashboard) o ejecuta la terminal como administrador.

### Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | URL canónica para metadata, Open Graph y sitemap. En Vercel se usa `VERCEL_URL` automáticamente si no la defines. |

### Notas de despliegue

- `.nvmrc` fija **Node 22** en Vercel.
- No hay base de datos, secretos ni servicios externos.
- `poweredByHeader: false` para no exponer la tecnología.
- El proyecto se puede importar desde GitHub o desplegar con la CLI.

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
- **Es un diseño preliminar.** No incluye autenticación, backend, service worker para offline ni notificaciones push reales.
- **No es un dispositivo médico.** El producto real debe evitar claims de diagnóstico y cumplir la normativa aplicable (NOM-015-STPS, LFPDPPP/LGPDPPSO, COFEPRIS, IFT, PROFECO).
- **Los umbrales** se configuran en °C; la vista convierte a °F.

## Rendimiento y Next.js

La app está pensada para Vercel y para que el shell se pinte de inmediato:

- **Todas las rutas son estáticas** (`○ Static`): `/`, `/historial`, `/alertas`, `/dispositivo`, `/ajustes`, `/manifest.webmanifest`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` y `/twitter-image`.
- **Cache Components** y **Partial Prefetching** están activos en `next.config.ts`.
- **No hay datos de servidor** que bloqueen el render: la simulación vive en el cliente. Por eso no hay waterfall ni un Suspense que esconda el shell.
- **Fuentes self-hosted** con `next/font` (Space Grotesk + IBM Plex Mono).
- **`optimizePackageImports`** para `lucide-react` y `recharts`.
- **Metadata de producción**: título por ruta, Open Graph, Twitter Card, manifest PWA, iconos 192/512, Apple Touch, `robots.txt` y `sitemap.xml`.
- **`poweredByHeader: false`** para no exponer la tecnología.
- **PWA base**: manifest e iconos listos; falta el service worker para offline (roadmap).

El loop de `instant()` de `next-cache-components-optimizer` no aplica aquí: no hay lecturas request-time que bloqueen la navegación. El shell completo es estático y se sirve desde el CDN de Vercel. Si después agregas datos de Neon, el patrón es mover la lectura detrás de `<Suspense>` y cachear solo lo reutilizable.

## Roadmap

- [x] Manifest PWA, iconos 192/512, Apple Touch y metadata Open Graph/Twitter.
- [x] Producción: `robots.txt`, `sitemap.xml`, 404 y error boundary.
- [ ] Conectar `Web Bluetooth` real y el servicio GATT del ESP32-C3.
- [ ] Backend en Vercel + Neon para historial multisesión.
- [ ] Service worker para PWA offline.
- [ ] Web Push con VAPID para alertas al contacto de emergencia.
- [ ] Autenticación y multi-dispositivo.
- [ ] Tests E2E con Playwright.
- [ ] Deploy en Vercel.

## Créditos

Diseño, código y datos simulados: Anael. Inspirado en la estética de la ciencia ficción; no usa marcas registradas de Star Wars.

## Licencia

MIT. Consulta [LICENSE](LICENSE).
