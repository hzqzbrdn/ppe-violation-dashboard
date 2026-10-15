"use client";
import { Bar, Line } from "react-chartjs-2";
import type { Violation, Granularity } from "@/lib/types";
import { bucketKey, bucketLabel, countBy } from "@/lib/format";
import { ensureChart, axisOptions } from "./chartBase";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

ensureChart();

export default function TimeSeries({ view, gran }: { view: Violation[]; gran: Granularity }) {
  const m = countBy(view, (v) => bucketKey(v, gran));
  const keys = [...m.keys()].map(String).sort();
  const labels = keys.map((k) => bucketLabel(k, gran));
  const vals = keys.map((k) => m.get(k)!);
  const line = gran !== "day";

  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Violations per {gran}
          <InfoTip tip="Number of PPE violations in each time bucket. Use the Group by toggle to switch between per-day, per-week and per-month totals. Respects the camera and date filters." />
        </h2>
        <span className="hint">
          {keys.length ? `${keys.length} ${gran}${keys.length > 1 ? "s" : ""} · ${view.length} total` : ""}
        </span>
      </div>
      <div className="chart">
        {view.length === 0 ? (
          <EmptyState msg="No violations in this range" />
        ) : line ? (
          <Line
            data={{
              labels,
              datasets: [
                {
                  data: vals,
                  backgroundColor: "rgba(198,137,60,.16)",
                  borderColor: "#c6893c",
                  borderWidth: 2,
                  fill: true,
                  tension: 0.32,
                  pointRadius: 3,
                  pointBackgroundColor: "#c6893c",
                },
              ],
            }}
            options={axisOptions()}
          />
        ) : (
          <Bar
            data={{
              labels,
              datasets: [{ data: vals, backgroundColor: "#c6893c", borderRadius: 6, maxBarThickness: 46 }],
            }}
            options={axisOptions()}
          />
        )}
      </div>
    </div>
  );
}
