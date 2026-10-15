"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Filters, Granularity, Violation } from "@/lib/types";
import { cameraColorMap, fetchViolations } from "@/lib/data";
import Reveal from "./Reveal";
import Toolbar from "./Toolbar";
import KpiStrip from "./KpiStrip";
import LatestCapture from "./LatestCapture";
import TimeSeries from "./TimeSeries";
import CameraDonut from "./CameraDonut";
import { HourProfile, WeekdayProfile } from "./Profiles";
import Heatmap from "./Heatmap";
import CameraTable from "./CameraTable";
import Gallery from "./Gallery";

type Status = "loading" | "ok" | "error";

export default function Dashboard() {
  const [all, setAll] = useState<Violation[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [records, setRecords] = useState(0);
  const [clock, setClock] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ camera: "", from: "", to: "" });
  const [gran, setGran] = useState<Granularity>("day");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lightbox, setLightbox] = useState<{ url: string; cap: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchViolations();
      setAll(data);
      setError(null);
      setStatus("ok");
      setRecords(data.length);
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (e) {
      setStatus("error");
      setError(
        `Can't reach the detector at /api/violations — ${(e as Error).message}. Is the camera host online?`,
      );
    }
  }, []);

  // initial load + silent background refresh every 30s
  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  // sync theme with <html data-theme> + persist (initialised from the inline boot script)
  useEffect(() => {
    const initial = (document.documentElement.dataset.theme as "light" | "dark") || "light";
    setTheme(initial);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("ppe-theme", next);
      } catch {}
      return next;
    });
  }, []);

  // keep relative "x min ago" labels ticking even without a refetch
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cams = useMemo(() => [...new Set(all.map((v) => v.camera))].sort(), [all]);
  const camColor = useMemo(() => cameraColorMap(cams), [cams]);

  const rangeFiltered = useMemo(
    () => all.filter((v) => (!filters.from || v.date >= filters.from) && (!filters.to || v.date <= filters.to)),
    [all, filters.from, filters.to],
  );
  const viewFiltered = useMemo(
    () => rangeFiltered.filter((v) => !filters.camera || v.camera === filters.camera),
    [rangeFiltered, filters.camera],
  );

  const openLb = useCallback((url: string, cap: string) => setLightbox({ url, cap }), []);
  const loading = status === "loading";

  return (
    <>
      <header>
        <nav className="nav">
          <div className="nav-pill nav-left">
            <div className="mark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Logo" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1>PPE Violation</h1>
              <div className="sub">Safety analytics · {cams.length || 0} cameras</div>
            </div>
          </div>

          <div className="nav-pill nav-right">
            <div className="status-chip">
              <span className={`dot${status === "ok" ? " live" : status === "error" ? " err" : ""}`} />
              {status === "error" ? (
                <span>Offline</span>
              ) : status === "loading" ? (
                <span>Connecting…</span>
              ) : (
                <>
                  <span className="live-tag">Live</span>
                  <span className="records">· {records} records</span>
                  <span>· {clock}</span>
                </>
              )}
            </div>
            <span className="nav-div" />
            <button
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <div className="wrap">
        {error && (
          <div className="banner">
            <svg viewBox="0 0 24 24">
              <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <Reveal delay={0}>
          <Toolbar cams={cams} filters={filters} setFilters={setFilters} gran={gran} setGran={setGran} />
        </Reveal>

        {loading ? (
          <Skeletons />
        ) : (
          <>
            <Reveal delay={1}>
              <KpiStrip view={viewFiltered} />
            </Reveal>

            <Reveal delay={2}>
              <LatestCapture view={viewFiltered} camColor={camColor} selected={filters.camera} onOpen={openLb} />
            </Reveal>

            <Reveal delay={3}>
              <div className="row main">
                <TimeSeries view={viewFiltered} gran={gran} />
                <CameraDonut rng={rangeFiltered} camColor={camColor} theme={theme} />
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="row half">
                <HourProfile view={viewFiltered} />
                <WeekdayProfile view={viewFiltered} />
              </div>
            </Reveal>

            <Reveal delay={5}>
              <Heatmap rng={rangeFiltered} cams={cams} camColor={camColor} selected={filters.camera} />
            </Reveal>

            <Reveal delay={6}>
              <CameraTable
                rng={rangeFiltered}
                cams={cams}
                camColor={camColor}
                selected={filters.camera}
                onSelect={(c) => setFilters((f) => ({ ...f, camera: c }))}
              />
            </Reveal>

            <Reveal delay={6}>
              <Gallery view={viewFiltered} camColor={camColor} onOpen={openLb} />
            </Reveal>
          </>
        )}
      </div>

      {lightbox && (
        <div className="lb" onClick={() => setLightbox(null)}>
          <div className="x">Close ✕</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox.url} alt="" />
          <div className="lcap">{lightbox.cap}</div>
        </div>
      )}
    </>
  );
}

function Skeletons() {
  return (
    <>
      <div className="kpis">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="kpi" key={i}>
            <div className="skel" style={{ height: 11, width: "60%" }} />
            <div className="skel" style={{ height: 24, width: "45%", marginTop: 10 }} />
            <div className="skel" style={{ height: 11, width: "70%", marginTop: 9 }} />
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="pbody">
          <div className="skel" style={{ height: 220 }} />
        </div>
      </div>
      <div className="row main">
        <div className="panel">
          <div className="chart">
            <div className="skel" style={{ height: "100%" }} />
          </div>
        </div>
        <div className="panel">
          <div className="chart">
            <div className="skel" style={{ height: "100%" }} />
          </div>
        </div>
      </div>
    </>
  );
}
