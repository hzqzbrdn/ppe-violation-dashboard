"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
  type ChartOptions,
} from "chart.js";

let registered = false;
export function ensureChart() {
  if (registered) return;
  ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Filler);
  ChartJS.defaults.font.family =
    'var(--font-jakarta), ui-sans-serif, system-ui, "Segoe UI", sans-serif';
  ChartJS.defaults.color = "#938b80";
  registered = true;
}

/** Shared axis/tooltip options matching the dashboard styling. */
export function axisOptions(extra?: Partial<ChartOptions<"bar" | "line">>): ChartOptions<"bar" | "line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: "easeOutCubic" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#2c2823",
        borderColor: "rgba(255,255,255,.12)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleColor: "#f5f1ea",
        bodyColor: "#cfc7bb",
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "#938b80", font: { size: 11 } },
        grid: { display: false },
        border: { color: "rgba(140,130,118,.3)" },
      },
      y: {
        ticks: { color: "#938b80", font: { size: 11 }, precision: 0 } as object,
        beginAtZero: true,
        grid: { color: "rgba(140,130,118,.16)" },
        border: { display: false },
      },
    },
    ...(extra as object),
  };
}
