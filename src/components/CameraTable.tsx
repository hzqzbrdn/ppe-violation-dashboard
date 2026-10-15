"use client";
import type { Violation } from "@/lib/types";
import { countBy, fmtDate, isoWeekStart, lastNDays, pad, todayStr } from "@/lib/format";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

function Spark({ counts }: { counts: number[] }) {
  const w = 86;
  const h = 24;
  const max = Math.max(1, ...counts);
  const n = counts.length;
  if (n <= 1) {
    const y = h - 2 - ((counts[0] || 0) / max) * (h - 4);
    return (
      <svg className="spark" width={w} height={h}>
        <circle cx={w / 2} cy={y} r={2.4} fill="var(--accent)" />
      </svg>
    );
  }
  const step = w / (n - 1);
  const pts = counts.map((c, i) => [i * step, h - 2 - (c / max) * (h - 4)] as const);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg className="spark" width={w} height={h}>
      <path d={area} fill="var(--accent-weak)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[n - 1][0].toFixed(1)} cy={pts[n - 1][1].toFixed(1)} r={2.2} fill="var(--accent)" />
    </svg>
  );
}

export default function CameraTable({
  rng,
  cams,
  camColor,
  selected,
  onSelect,
}: {
  rng: Violation[];
  cams: string[];
  camColor: Record<string, string>;
  selected: string;
  onSelect: (cam: string) => void;
}) {
  const today = todayStr();
  const wkStart = fmtDate(isoWeekStart(new Date()));
  const month = today.slice(0, 7);
  const total = rng.length;
  const days14 = lastNDays(14);

  const rows = cams
    .map((cam) => {
      const recs = rng.filter((v) => v.camera === cam);
      const hr = countBy(recs, (v) => v.hour);
      let peakH = "—";
      let pn = 0;
      hr.forEach((n, h) => {
        if (n > pn) {
          pn = n;
          peakH = pad(Number(h)) + ":00";
        }
      });
      const dayCount = countBy(recs, (v) => v.date);
      const spark = days14.map((d) => (dayCount.get(d) as number) || 0);
      return {
        cam,
        total: recs.length,
        today: recs.filter((v) => v.date === today).length,
        week: recs.filter((v) => fmtDate(isoWeekStart(v.dt)) >= wkStart).length,
        month: recs.filter((v) => v.date.slice(0, 7) === month).length,
        peakH,
        spark,
      };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total);
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Per-camera breakdown
          <InfoTip tip="Every camera compared side by side. Share = its percent of all violations. Today / 7-day / 30-day = its counts over those recent windows. Peak hr = its busiest hour. Trend = daily counts over the last 14 days. Click a row to filter the whole dashboard to that camera." />
        </h2>
        <span className="hint">click a row to filter · trend = last 14 days in range</span>
      </div>
      <div className="pbody">
        {rows.length === 0 ? (
          <EmptyState grid msg="No violations in this range" />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Camera</th>
                <th>Share</th>
                <th>Total</th>
                <th className="opt">Today</th>
                <th className="opt">7-day</th>
                <th className="opt">30-day</th>
                <th className="opt">Peak hr</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.cam}
                  className={selected === r.cam ? "sel" : ""}
                  onClick={() => onSelect(selected === r.cam ? "" : r.cam)}
                >
                  <td>
                    <div className="cam-cell">
                      <span className="cam-chip" style={{ background: camColor[r.cam] }} />
                      {r.cam}
                    </div>
                  </td>
                  <td>
                    <div className="share">
                      <span className="num" style={{ color: "var(--muted)" }}>
                        {((r.total / total) * 100).toFixed(1)}%
                      </span>
                      <span className="bar">
                        <i style={{ width: `${((r.total / max) * 100).toFixed(0)}%` }} />
                      </span>
                    </div>
                  </td>
                  <td className="num">{r.total}</td>
                  <td className="num opt">{r.today}</td>
                  <td className="num opt">{r.week}</td>
                  <td className="num opt">{r.month}</td>
                  <td className="num opt" style={{ color: "var(--muted)" }}>
                    {r.peakH}
                  </td>
                  <td>
                    <Spark counts={r.spark} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
