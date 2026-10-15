"use client";
import type { Violation } from "@/lib/types";
import { pad } from "@/lib/format";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

const BLOCKS = 8; // 3-hour blocks

export default function Heatmap({
  rng,
  cams,
  camColor,
  selected,
}: {
  rng: Violation[];
  cams: string[];
  camColor: Record<string, string>;
  selected: string;
}) {
  const active = cams.filter((c) => rng.some((v) => v.camera === c));
  const grid: Record<string, number[]> = {};
  active.forEach((c) => (grid[c] = new Array(BLOCKS).fill(0)));
  rng.forEach((v) => {
    const b = Math.floor(v.hour / 3);
    if (grid[v.camera]) grid[v.camera][b]++;
  });
  let max = 0;
  active.forEach((c) => grid[c].forEach((n) => (n > max ? (max = n) : 0)));
  const label = (b: number) => `${pad(b * 3)}–${pad(b * 3 + 2)}`;

  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Camera × hour heatmap
          <InfoTip tip="Each row is a camera; each column is a 3-hour block of the day (00–02, 03–05, …). The number and the brighter amber show how many violations that camera recorded in that block. Σ is the camera's total." />
        </h2>
        <span className="hint">violations by camera and hour · current range</span>
      </div>
      <div className="pbody">
        {rng.length === 0 ? (
          <EmptyState grid msg="No violations in this range" />
        ) : (
          <>
            <div className="heat-scroll">
              <div className="heat">
                <div className="corner" />
                {[...Array(BLOCKS).keys()].map((b) => (
                  <div className="hh" key={b}>
                    {label(b)}
                  </div>
                ))}
                <div className="hh tot">Σ</div>
                {active.map((c) => {
                  const total = grid[c].reduce((a, b) => a + b, 0);
                  return (
                    <HeatRow
                      key={c}
                      cam={c}
                      counts={grid[c]}
                      total={total}
                      max={max}
                      color={camColor[c]}
                      sel={selected === c}
                    />
                  );
                })}
              </div>
            </div>
            <div className="heat-legend">
              <span>0</span>
              <div className="bar" />
              <span>{max}</span>
              <span className="sp">violations per 3-hour block</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HeatRow({
  cam,
  counts,
  total,
  max,
  color,
  sel,
}: {
  cam: string;
  counts: number[];
  total: number;
  max: number;
  color: string;
  sel: boolean;
}) {
  return (
    <>
      <div className={`rl${sel ? " sel" : ""}`}>
        <span className="cam-chip" style={{ background: color }} />
        {cam}
      </div>
      {counts.map((n, b) => {
        const tip = `${cam} · ${pad(b * 3)}:00–${pad(b * 3 + 2)}:59 — ${n} violation${n === 1 ? "" : "s"}`;
        if (!n) return <div className="cell" title={tip} key={b} />;
        const a = 0.28 + 0.72 * (n / max);
        return (
          <div
            className="cell"
            key={b}
            title={tip}
            style={{ background: `rgba(198,137,60,${a.toFixed(3)})`, color: "#3c2a12" }}
          >
            {n}
          </div>
        );
      })}
      <div className="rt">{total}</div>
    </>
  );
}
