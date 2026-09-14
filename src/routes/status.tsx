import { createFileRoute } from "@tanstack/react-router";

import { ApiStatusCard } from "@/components/site/ApiStatusCard";
import { absoluteUrl } from "@/config/site";
import { useApiInfo } from "@/hooks/use-api-status";

const description =
  "Cek status API layanan Alight Motion Premium Creator: online/offline, version, uptime, dan waktu pemeriksaan terakhir.";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "API Status — Alight Motion Premium Creator" },
      { name: "description", content: description },
      { property: "og:title", content: "API Status — Alight Motion Premium Creator" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/status") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/status") }],
  }),
  component: StatusPage,
});

function StatusPage() {
  const info = useApiInfo();

  return (
    <section className="container-page pt-12">
      <h1 className="text-3xl font-semibold sm:text-4xl">API Status</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Halaman ini memeriksa apakah layanan sedang dapat dihubungi. Jika Offline, tunggu beberapa
        saat lalu tekan Refresh Status.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[20rem_1fr]">
        <ApiStatusCard />

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">Paket yang tersedia</h2>
          {info.data?.ok ? (
            <>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-muted-foreground">Plan</dt>
                  <dd className="mt-0.5 font-medium">{info.data.plan?.name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Tipe</dt>
                  <dd className="mt-0.5 font-medium">{info.data.plan?.type ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Durasi</dt>
                  <dd className="mt-0.5 font-medium">{info.data.plan?.duration ?? "—"}</dd>
                </div>
              </dl>
              {info.data.benefits && info.data.benefits.length > 0 && (
                <ul className="mt-6 grid gap-2 border-t border-border pt-5 sm:grid-cols-2">
                  {info.data.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <i className="fa-solid fa-check mt-1 text-success" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              {info.isPending
                ? "Mengambil informasi paket..."
                : "Informasi paket belum bisa diambil karena layanan sedang tidak dapat dihubungi."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
