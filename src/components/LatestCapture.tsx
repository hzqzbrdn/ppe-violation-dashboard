"use client";
import type { Violation } from "@/lib/types";
import { imgUrl, relTime } from "@/lib/format";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

export default function LatestCapture({
  view,
  camColor,
  selected,
  onOpen,
}: {
  view: Violation[];
  camColor: Record<string, string>;
  selected: string;
  onOpen: (url: string, cap: string) => void;
}) {
  const chip = (c: string) => (
    <span className="cam-chip" style={{ background: camColor[c] || "var(--accent)" }} />
  );

  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Latest capture
          <InfoTip tip="The most recent violation snapshot in the current view. Pick a camera to see that camera's latest capture. Click the image to enlarge." />
        </h2>
        <span className="hint">most recent in view</span>
      </div>
      <div className="pbody">
        {view.length === 0 ? (
          <EmptyState grid msg="No captures match the current filters" />
        ) : (
          (() => {
            const v = view[0];
            const url = imgUrl(v.url);
            const rel = relTime(v.mtime);
            const prev = view.slice(1, 6);
            return (
              <div className="latest">
                <div
                  className="latest-hero"
                  onClick={() => onOpen(url, `${v.camera} · ${v.date} ${v.time}`)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Latest violation from ${v.camera}`} />
                  <div className="latest-overlay">
                    <div className="latest-top">
                      {rel ? (
                        <span className="latest-rel">
                          <span className="dot" />
                          {rel}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="expand">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                        Enlarge
                      </span>
                    </div>
                    <div className="latest-hero-meta">
                      <div className="latest-cam">
                        {chip(v.camera)}
                        {v.camera}
                      </div>
                      <div className="latest-time">
                        {v.date} · {v.time}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="latest-side">
                  <div className="latest-side-head">
                    <span>Previous captures</span>
                    <span>{prev.length || ""}</span>
                  </div>
                  {prev.length ? (
                    <div className="latest-list">
                      {prev.map((p, i) => (
                        <button
                          key={i}
                          className="lrow"
                          onClick={() => onOpen(imgUrl(p.url), `${p.camera} · ${p.date} ${p.time}`)}
                        >
                          <span className="lrow-thumb">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img loading="lazy" src={imgUrl(p.url)} alt={p.camera} />
                          </span>
                          <span className="lrow-info">
                            <span className="lrow-cam">
                              {chip(p.camera)}
                              {p.camera}
                            </span>
                            <span className="lrow-time">
                              {relTime(p.mtime)} · {p.time.slice(0, 5)}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="latest-side-empty">
                      No earlier captures
                      <br />
                      in this view yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
