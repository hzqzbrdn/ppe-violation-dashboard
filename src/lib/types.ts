/** A single PPE violation record as returned by the detection source. */
export interface RawViolation {
  camera: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  mtime: number; // epoch seconds
  url: string; // image path relative to the source root
}

/** A violation enriched with derived fields used across the dashboard. */
export interface Violation extends RawViolation {
  dt: Date;
  hour: number; // 0..23
  dow: number; // 0 = Monday … 6 = Sunday
}

export type Granularity = "day" | "week" | "month";

export interface Filters {
  camera: string; // "" = all
  from: string; // YYYY-MM-DD or ""
  to: string; // YYYY-MM-DD or ""
}
