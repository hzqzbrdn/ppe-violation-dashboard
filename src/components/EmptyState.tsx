export default function EmptyState({ msg, grid }: { msg: string; grid?: boolean }) {
  return (
    <div className="empty">
      <svg viewBox="0 0 24 24">
        {grid ? (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </>
        ) : (
          <>
            <path d="M3 3v18h18" />
            <path d="m7 14 4-4 3 3 5-6" />
          </>
        )}
      </svg>
      <div className="t">Nothing to show</div>
      <div className="d">{msg}</div>
    </div>
  );
}
