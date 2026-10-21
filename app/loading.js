export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <span className="route-loading-mark" aria-hidden="true">
        ✳
      </span>
      <span>Preparing your visit…</span>
    </div>
  );
}
