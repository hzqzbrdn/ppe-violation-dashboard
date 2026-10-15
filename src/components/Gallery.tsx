"use client";
import type { Violation } from "@/lib/types";
import { imgUrl } from "@/lib/format";
import EmptyState from "./EmptyState";
import InfoTip from "./InfoTip";

export default function Gallery({
  view,
  camColor,
  onOpen,
}: {
  view: Violation[];
  camColor: Record<string, string>;
  onOpen: (url: string, cap: string) => void;
}) {
  const show = view.slice(0, 48);
  return (
    <div className="panel">
      <div className="phead">
        <h2>
          Recent violations
          <InfoTip tip="The newest violation snapshots captured by the cameras, with the detector's bounding boxes. Click any image to view it full size." />
        </h2>
        <span className="hint">{view.length ? `showing ${show.length} of ${view.length}` : ""}</span>
      </div>
      <div className="pbody">
        {show.length === 0 ? (
          <EmptyState grid msg="No snapshots match the current filters" />
        ) : (
          <div className="gallery">
            {show.map((v, i) => {
              const url = imgUrl(v.url);
              return (
                <div className="shot" key={i} onClick={() => onOpen(url, `${v.camera} · ${v.date} ${v.time}`)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img loading="lazy" src={url} alt={v.camera} />
                  <div className="cap">
                    <div className="c">
                      <span className="cam-chip sm" style={{ background: camColor[v.camera] }} />
                      {v.camera}
                    </div>
                    <div className="t num">
                      {v.date} {v.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
