import { useApiHealth } from "@/hooks/use-api-status";

export function ApiStatusDot() {
  const { data, isPending } = useApiHealth();
  const online = data?.online === true;

  const label = isPending ? "Memeriksa" : online ? "API Online" : "API Offline";
  const dotClass = isPending
    ? "bg-muted-foreground"
    : online
      ? "bg-success"
      : "bg-destructive";

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}
