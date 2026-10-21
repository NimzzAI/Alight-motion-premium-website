import { useApiHealth } from "@/hooks/use-api-status";

export function ApiStatusDot() {
  const { data, isPending } = useApiHealth();
  const online = data?.online === true;

  const label = isPending
    ? "Memeriksa Koneksi API"
    : online
      ? "Gateway API Online"
      : "Gateway API Offline";

  const iconClass = isPending
    ? "fa-solid fa-spinner fa-spin text-muted-foreground"
    : online
      ? "fa-solid fa-circle-check text-success"
      : "fa-solid fa-triangle-exclamation text-destructive";

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums">
      <i className={iconClass} aria-hidden="true" />
      <span className="font-medium text-foreground">{label}</span>
      {data?.version && online && (
        <>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span>v{data.version}</span>
        </>
      )}
    </div>
  );
}
