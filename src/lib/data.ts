import type { RawViolation, Violation } from "./types";

/** Warm, earthy categorical palette to match the frosted-glass theme. */
export const CAM_COLORS = [
  "#c6893c", // bronze
  "#7f93b5", // dusty blue
  "#8aa06f", // sage
  "#c57b63", // terracotta
  "#b9a06a", // sand
  "#9387b0", // dusty violet
  "#6fa6a3", // muted teal
];

export function enrich(raw: RawViolation[]): Violation[] {
  return raw
    .map((v) => {
      const dt = new Date(`${v.date}T${v.time || "00:00:00"}`);
      return {
        ...v,
        dt,
        hour: v.time ? parseInt(v.time.slice(0, 2), 10) : 0,
        dow: (dt.getDay() + 6) % 7,
      };
    })
    .sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
}

export function cameraColorMap(cams: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  cams.forEach((c, i) => (map[c] = CAM_COLORS[i % CAM_COLORS.length]));
  return map;
}

/** Fetch the violation feed from our same-origin proxy route. */
export async function fetchViolations(): Promise<Violation[]> {
  const res = await fetch("/api/violations", { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: RawViolation[] = await res.json();
  return enrich(data);
}
