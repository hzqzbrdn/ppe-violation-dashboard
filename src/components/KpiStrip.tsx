"use client";
import type { Violation } from "@/lib/types";
import { countBy, fmtDate, isoWeekStart, monthLabel, pad, todayStr, weekLabel } from "@/lib/format";
import InfoTip from "./InfoTip";

export default function KpiStrip({ view }: { view: Violation[] }) {
  const today = todayStr();
  const wkStart = fmtDate(isoWeekStart(new Date()));
  const month = today.slice(0, 7);
  const nToday = view.filter((v) => v.date === today).length;
  const nWeek = view.filter((v) => fmtDate(isoWeekStart(v.dt)) >= wkStart).length;
  const nMonth = view.filter((v) => v.date.slice(0, 7) === month).length;
  const cams = new Set(view.map((v) => v.camera)).size;
  const days = new Set(view.map((v) => v.date)).size || 1;

  const hr = countBy(view, (v) => v.hour);
  let peakH = "—";
  let peakN = 0;
  hr.forEach((n, h) => {
    if (n > peakN) {
      peakN = n;
      peakH = pad(Number(h)) + ":00";
    }
  });
  const cm = countBy(view, (v) => v.camera);
  let topCam = "—";
  let topN = 0;
  cm.forEach((n, c) => {
    if (n > topN) {
      topN = n;
      topCam = String(c);
    }
  });

  const items = [
    {
      l: "Violations",
      v: view.length,
      s: (
        <>
          <b>{(view.length / days).toFixed(1)}</b>&nbsp;/ active day
        </>
      ),
      accent: true,
      tip: "Total PPE violations matching the current camera and date filters. The small number is the average per day that actually had at least one violation.",
    },
    { l: "Today", v: nToday, s: today, tip: `Violations detected today (${today}), in the current view.` },
    {
      l: "This week",
      v: nWeek,
      s: "since " + weekLabel(wkStart).replace("wk ", ""),
      tip: "Violations since Monday of the current week.",
    },
    { l: "This month", v: nMonth, s: monthLabel(month), tip: `Violations so far in the current calendar month (${monthLabel(month)}).` },
    {
      l: "Peak hour",
      v: peakH,
      s: peakN ? (
        <>
          <b>{peakN}</b>&nbsp;violations
        </>
      ) : (
        "—"
      ),
      r: true,
      tip: "The single hour of the day with the most violations in the current view, and how many occurred in it.",
    },
    {
      l: "Top camera",
      v: topCam,
      s: topN ? (
        <>
          <b>{topN}</b>&nbsp;violations
        </>
      ) : (
        "—"
      ),
      r: true,
      tip: "The camera responsible for the most violations in the current view, and its count.",
    },
  ];

  return (
    <div className="kpis">
      {items.map((k, i) => (
        <div className={`kpi${k.accent ? " accent" : ""}`} key={i}>
          <div className="l">
            {k.l}
            <InfoTip tip={k.tip} variant={k.r ? "r down" : "down"} />
          </div>
          <div className="v num">{k.v}</div>
          <div className="s">{k.s}</div>
        </div>
      ))}
    </div>
  );
}
