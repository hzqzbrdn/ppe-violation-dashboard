"use client";
import { Doughnut } from "react-chartjs-2";
import type { Violation } from "@/lib/types";
import { countBy } from "@/lib/format";
import { ensureChart } from "./chartBase";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

ensureChart();

export default function CameraDonut({
  rng,
  camColor,
  theme = "light",
}: {
  rng: Violation[];
  camColor: Record<string, string>;
  theme?: "light" | "dark";
}) {
  const sliceBorder = theme === "dark" ? "rgba(21,19,15,.65)" : "rgba(255,255,255,.7)";
  const legendColor = theme === "dark" ? "#a59d92" : "#6f685f";
  const m = countBy(rng, (v) => v.camera);
  const entries = [...m.entries()].sort((a, b) => b[1] - a[1]);
  const total = rng.length;

  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Share by camera
          <InfoTip
            variant="r"
            tip="What portion of all violations each camera is responsible for, over the selected date range. A big slice means that camera flags the most violations."
          />
        </h2>
        <span className="hint">current range</span>
      </div>
      <div className="chart">
        {entries.length === 0 ? (
          <EmptyState msg="No data" />
        ) : (
          <Doughnut
            data={{
              labels: entries.map((e) => e[0]),
              datasets: [
                {
                  data: entries.map((e) => e[1]),
                  backgroundColor: entries.map((e) => camColor[e[0]]),
                  borderColor: sliceBorder,
                  borderWidth: 3,
                  hoverOffset: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "62%",
              animation: { duration: 500 },
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    color: legendColor,
                    boxWidth: 9,
                    boxHeight: 9,
                    usePointStyle: true,
                    pointStyle: "circle",
                    padding: 11,
                    font: { size: 12 },
                  },
                },
                tooltip: {
                  backgroundColor: "#2c2823",
                  borderColor: "rgba(255,255,255,.12)",
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 10,
                  displayColors: false,
                  callbacks: {
                    label: (c) => `${c.label}: ${c.parsed} (${((c.parsed / total) * 100).toFixed(1)}%)`,
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
