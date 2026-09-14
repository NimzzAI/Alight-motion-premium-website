import { Button } from "@/components/ui/button";
import { formatTime, formatUptime, useApiHealth } from "@/hooks/use-api-status";

export function ApiStatusCard() {
  const { data, isFetching, refetch } = useApiHealth();
  const online = data?.online === true;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        API Status
      </p>
      <p className="mt-2 flex items-center gap-2.5 text-2xl font-semibold">
        <span
          className={`h-3 w-3 rounded-full ${online ? "bg-success" : "bg-destructive"}`}
          aria-hidden="true"
        />
        {online ? "Online" : "Offline"}
      </p>

      {online ? (
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Version</dt>
            <dd className="font-medium">{data?.version ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Uptime</dt>
            <dd className="font-medium">{formatUptime(data?.uptime)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last checked</dt>
            <dd className="font-medium">{formatTime(data?.checkedAt)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          API sedang tidak dapat dihubungi. Periksa koneksi internet kamu, lalu tekan Refresh
          Status.
        </p>
      )}

      <Button
        variant="outline"
        className="mt-6 w-full"
        onClick={() => void refetch()}
        disabled={isFetching}
      >
        {isFetching ? (
          <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-rotate-right" aria-hidden="true" />
        )}
        {isFetching ? "Memeriksa..." : "Refresh Status"}
      </Button>
    </div>
  );
}
