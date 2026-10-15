"use client";
import { Bar } from "react-chartjs-2";
import type { Violation } from "@/lib/types";
import { pad, WEEKDAYS } from "@/lib/format";
import { ensureChart, axisOptions } from "./chartBase";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

ensureChart();

export function HourProfile({ view }: { view: Violation[] }) {
  const vals = new Array(24).fill(0);
  view.forEach((v) => vals[v.hour]++);
  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Hour-of-day profile
          <InfoTip tip="Violations grouped by hour of the day (00–23), adding up every day in the current range. Tall bars show the times of day when violations happen most." />
        </h2>
        <span className="hint">when violations happen</span>
      </div>
      <div className="chart sm">
        {view.length === 0 ? (
          <EmptyState msg="No data" />
        ) : (
          <Bar
            data={{
              labels: [...Array(24).keys()].map((h) => pad(h)),
              datasets: [{ data: vals, backgroundColor: "#7f93b5", borderRadius: 4, maxBarThickness: 18 }],
            }}
            options={axisOptions()}
          />
        )}
      </div>
    </div>
  );
}

export function WeekdayProfile({ view }: { view: Violation[] }) {
  const vals = new Array(7).fill(0);
  view.forEach((v) => vals[v.dow]++);
  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Weekday profile
          <InfoTip
            variant="r"
            tip="Violations grouped by day of the week (Monday–Sunday), adding up every week in the current range. Shows which weekdays tend to be worst."
          />
        </h2>
        <span className="hint">Mon–Sun</span>
      </div>
      <div className="chart sm">
        {view.length === 0 ? (
          <EmptyState msg="No data" />
        ) : (
          <Bar
            data={{
              labels: WEEKDAYS,
              datasets: [{ data: vals, backgroundColor: "#8aa06f", borderRadius: 5, maxBarThickness: 40 }],
            }}
            options={axisOptions()}
          />
        )}
      </div>
    </div>
  );
}
