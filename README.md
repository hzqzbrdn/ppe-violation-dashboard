# PPE Detection Dashboard (Next.js + TypeScript)

A viewing and analytics dashboard for the PPE violation detector at
`http://192.168.0.161:8090/`, rebuilt on **Next.js 14 (App Router) + TypeScript**.

This replaces the earlier `python + single-HTML` version: the Python proxy is now
**Next.js route handlers**, and the dashboard is typed React components. One stack,
one process.

## Why route handlers?

The detection source sends **no CORS headers**, so a browser can't fetch it
directly. The server-side route handlers proxy it, keeping everything same-origin:

| Route                 | Purpose                                             |
|-----------------------|-----------------------------------------------------|
| `/`                   | the dashboard (React)                               |
| `GET /api/violations` | proxies the source's JSON feed                      |
| `GET /api/img/*`      | proxies violation snapshot images from the source   |

The upstream URL defaults to `http://192.168.0.161:8090` and can be overridden with
the `PPE_UPSTREAM` environment variable.

## Run

Install once:

```bash
npm install
```

**Development** (hot reload):

```bash
npm run dev
```

**Production** (what you deploy):

```bash
npm run build
npm run start          # localhost only, port 8099
```

**Broadcast on the LAN** (other devices can view it):

```bash
npm run build
npm run lan            # binds 0.0.0.0:8099
```

Then from any device on the same network: `http://192.168.0.38:8099/`
(that is this machine's Wi-Fi IP — same subnet as the cameras).

> LAN note: Windows Firewall must allow inbound TCP 8099. In an **Administrator**
> PowerShell:
> `New-NetFirewallRule -DisplayName "PPE Dashboard 8099" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8099 -Profile Any -RemoteAddress LocalSubnet`

Point at a different camera host:

```bash
PPE_UPSTREAM=http://<host>:<port> npm run lan
```

## Stack & structure

- **Next.js 14** App Router, **TypeScript** (strict), **React 18**
- **Chart.js 4** via `react-chartjs-2`
- Fonts self-hosted via `next/font` (Space Grotesk, Plus Jakarta Sans, JetBrains
  Mono) — **no runtime Google Fonts dependency**, works fully offline on the LAN

```
src/
  app/
    layout.tsx                  fonts + metadata
    page.tsx                    renders <Dashboard/>
    globals.css                 the full premium design
    api/violations/route.ts     JSON proxy
    api/img/[...path]/route.ts  image proxy
  lib/
    types.ts                    Violation / Filters / Granularity
    format.ts                   dates, buckets, relative time
    data.ts                     fetch + enrich + camera palette
  components/
    Dashboard.tsx               state + layout orchestrator
    Toolbar, KpiStrip, LatestCapture, TimeSeries, CameraDonut,
    Profiles (hour/weekday), Heatmap, CameraTable, Gallery,
    Reveal, InfoTip, EmptyState, chartBase
```

## Features

- KPI strip (violations / today / week / month / peak hour / top camera)
- Latest-capture hero + "previous captures" filmstrip, with live "x min ago"
- Time series grouped per **day / week / month**
- Share-by-camera donut, hour-of-day and weekday profiles
- Camera × hour heatmap (3-hour blocks, per-camera totals)
- Per-camera breakdown table with 14-day trend sparklines (click a row to filter)
- Recent-violations gallery with lightbox
- Camera + date-range filters, auto-refresh (30s), info tooltips everywhere
- Premium dark design: machined "double-bezel" panels, floating glass nav,
  scroll-reveal motion; fully responsive

## Data limitation

The source exposes only camera + timestamp + image per violation — no PPE *type*
(helmet vs. vest) or worker/zone. Analytics are therefore over time, camera, and
hour. If the detector can expose the violation type, a by-category breakdown can be
added.
