import { Link, createFileRoute } from "@tanstack/react-router";

import { ApiStatusCard } from "@/components/site/ApiStatusCard";
import { SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { buildPageSeo } from "@/config/site";
import { useApiInfo } from "@/hooks/use-api-status";

const description =
  "Cek status API layanan Alight Motion Premium Creator secara real-time: status online/offline, versi server, uptime, dan spesifikasi paket.";

export const Route = createFileRoute("/status")({
  head: () =>
    buildPageSeo({
      title: "Status Gateway API — Alight Motion Premium Creator",
      description,
      path: "/status",
    }),
  component: StatusPage,
});

function StatusPage() {
  const info = useApiInfo();

  return (
    <section className="container-page pt-10 pb-12 sm:pt-14">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <SectionIndex
            index="MONITORING"
            label="Ketersediaan Gateway & Spesifikasi Paket"
            detail="Live Check"
          />
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Status Gateway API</h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Halaman ini memeriksa kondisi koneksi server aktivasi secara langsung. Jika status
            menunjukkan tidak terhubung, tunggu beberapa saat lalu tekan tombol penyegaran.
          </p>
        </div>

        <Button asChild className="motion-press gap-2">
          <Link to="/aktivasi">
            <i className="fa-solid fa-bolt text-xs" aria-hidden="true" />
            <span>Menuju Konsol Aktivasi</span>
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="animate-fade-up stagger-1">
          <ApiStatusCard />
        </div>

        <SpotlightSurface className="animate-fade-up stagger-2 p-6 sm:p-8" interactive={false}>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground">KONFIGURASI LAYANAN</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">
                Spesifikasi Paket yang Tersedia
              </h2>
            </div>
            <i className="fa-solid fa-cubes text-lg text-primary" aria-hidden="true" />
          </div>

          {info.data?.ok ? (
            <>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-surface/60 p-4">
                  <dt className="font-mono text-xs text-muted-foreground">NAMA PAKET</dt>
                  <dd className="mt-1.5 font-semibold text-foreground">
                    {info.data.plan?.name ?? "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-surface/60 p-4">
                  <dt className="font-mono text-xs text-muted-foreground">TIPE LISENSI</dt>
                  <dd className="mt-1.5 font-semibold text-foreground">
                    {info.data.plan?.type ?? "—"}
                  </dd>
                </div>
                <div className="rounded-lg border border-border bg-surface/60 p-4">
                  <dt className="font-mono text-xs text-muted-foreground">DURASI AKTIF</dt>
                  <dd className="mt-1.5 font-mono font-semibold text-foreground tabular-nums">
                    {info.data.plan?.duration ?? "—"}
                  </dd>
                </div>
              </dl>

              {info.data.benefits && info.data.benefits.length > 0 && (
                <div className="mt-6 border-t border-border pt-6">
                  <p className="font-mono text-xs font-semibold text-muted-foreground">
                    DAFTAR KEUNTUNGAN PAKET
                  </p>
                  <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                    {info.data.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <i
                          className="fa-solid fa-check mt-1 text-xs text-success"
                          aria-hidden="true"
                        />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-surface p-5 text-sm text-muted-foreground">
              <i
                className={
                  info.isPending
                    ? "fa-solid fa-spinner fa-spin text-primary"
                    : "fa-solid fa-circle-info text-muted-foreground"
                }
                aria-hidden="true"
              />
              <span>
                {info.isPending
                  ? "Mengambil spesifikasi paket dari gateway API..."
                  : "Rincian paket belum dapat dimuat karena layanan sedang tidak terhubung."}
              </span>
            </div>
          )}
        </SpotlightSurface>
      </div>
    </section>
  );
}
