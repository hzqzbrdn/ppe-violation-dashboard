"use client";
import type { Filters, Granularity } from "@/lib/types";

const GRANS: Granularity[] = ["day", "week", "month"];

export default function Toolbar({
  cams,
  filters,
  setFilters,
  gran,
  setGran,
}: {
  cams: string[];
  filters: Filters;
  setFilters: (f: Filters) => void;
  gran: Granularity;
  setGran: (g: Granularity) => void;
}) {
  return (
    <div className="toolbar">
      <div className="field">
        <span>Camera</span>
        <select value={filters.camera} onChange={(e) => setFilters({ ...filters, camera: e.target.value })}>
          <option value="">All cameras</option>
          {cams.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <span>Group by</span>
        <div className="seg">
          {GRANS.map((g) => (
            <button key={g} className={gran === g ? "on" : ""} onClick={() => setGran(g)}>
              {g[0].toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>From</span>
        <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
      </div>
      <div className="field">
        <span>To</span>
        <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
      </div>
      <div className="field">
        <span>&nbsp;</span>
        <button className="btn" onClick={() => setFilters({ ...filters, from: "", to: "" })}>
          Reset range
        </button>
      </div>
    </div>
  );
}
