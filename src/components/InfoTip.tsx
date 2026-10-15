export default function InfoTip({ tip, variant }: { tip: string; variant?: "r" | "down" | "r down" }) {
  return (
    <span className={`info${variant ? " " + variant : ""}`} tabIndex={0} data-tip={tip}>
      i
    </span>
  );
}
