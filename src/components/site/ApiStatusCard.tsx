import { SpotlightSurface } from "@/components/site/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { formatTime, formatUptime, useApiHealth } from "@/hooks/use-api-status";

export function ApiStatusCard() {
  const { data, isFetching, refetch } = useApiHealth();
  const online = data?.online === true;

  return (
    <SpotlightSurface className="p-6" interactive={false}>
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">API Status</p>
          <p className="mt-1 flex items-center gap-2 text-xl font-semibold text-foreground">
            <i
              className={
                online
                  ? "fa-solid fa-circle-check text-base text-success"
                  : "fa-solid fa-circle-exclamation text-base text-destructive"
              }
              aria-hidden="true"
            />
            <span>{online ? "Online" : "Offline"}</span>
          </p>
        </div>
      </div>

      {online ? (
        <dl className="mt-5 divide-y divide-border/70 text-sm">
          <div className="flex items-center justify-between py-2.5">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-code-commit w-4 text-center text-xs" aria-hidden="true" />
              <span>Version</span>
            </dt>
            <dd className="font-mono font-medium text-foreground tabular-nums">
              {data?.version ?? "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-regular fa-clock w-4 text-center text-xs" aria-hidden="true" />
              <span>Uptime</span>
            </dt>
            <dd className="font-mono font-medium text-foreground tabular-nums">
              {formatUptime(data?.uptime)}
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <i className="fa-solid fa-stopwatch w-4 text-center text-xs" aria-hidden="true" />
              <span>Last checked</span>
            </dt>
            <dd className="font-mono font-medium text-foreground tabular-nums">
              {formatTime(data?.checkedAt)}
            </dd>
          </div>
        </dl>
      ) : (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/6 p-3.5 text-sm leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-2.5">
            <i
              className="fa-solid fa-plug-circle-xmark mt-0.5 text-destructive"
              aria-hidden="true"
            />
            <span>
              API sedang tidak dapat dihubungi. Periksa koneksi internet kamu, lalu tekan Refresh
              Status.
            </span>
          </p>
        </div>
      )}

      <Button
        variant="outline"
        className="motion-press mt-5 w-full gap-2"
        onClick={() => void refetch()}
        disabled={isFetching}
      >
        <i
          className={isFetching ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-rotate-right"}
          aria-hidden="true"
        />
        <span>{isFetching ? "Memeriksa..." : "Refresh Status"}</span>
      </Button>
    </SpotlightSurface>
  );
}
