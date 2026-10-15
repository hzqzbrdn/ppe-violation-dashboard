import type { Granularity, Violation } from "./types";

export const pad = (n: number) => String(n).padStart(2, "0");

export const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayStr = () => fmtDate(new Date());

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Monday-start ISO week beginning for a date. */
export function isoWeekStart(d: Date): Date {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function weekLabel(startStr: string): string {
  const d = new Date(`${startStr}T00:00:00`);
  return `wk ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export function bucketKey(v: Violation, g: Granularity): string {
  if (g === "week") return fmtDate(isoWeekStart(v.dt));
  if (g === "month") return v.date.slice(0, 7);
  return v.date;
}

export function bucketLabel(key: string, g: Granularity): string {
  if (g === "week") return weekLabel(key);
  if (g === "month") return monthLabel(key);
  return key.slice(5); // MM-DD
}

/** "x min ago" style relative time from an epoch-seconds value. */
export function relTime(mtime: number): string {
  if (!mtime) return "";
  const s = Date.now() / 1000 - mtime;
  if (s < 60) return "just now";
  const m = s / 60;
  if (m < 60) return `${Math.floor(m)} min ago`;
  const h = m / 60;
  if (h < 24) {
    const n = Math.floor(h);
    return `${n} ${n === 1 ? "hour" : "hours"} ago`;
  }
  const d = Math.floor(h / 24);
  return `${d} ${d === 1 ? "day" : "days"} ago`;
}

export function countBy<T>(arr: T[], fn: (x: T) => string | number): Map<string | number, number> {
  const m = new Map<string | number, number>();
  for (const x of arr) {
    const k = fn(x);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  const base = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    out.push(fmtDate(d));
  }
  return out;
}

/** Image URL proxied through our own API route (keeps everything same-origin). */
export const imgUrl = (url: string) => `/api/img/${url.split("/").map(encodeURIComponent).join("/")}`;
