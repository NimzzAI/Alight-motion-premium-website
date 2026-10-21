import { Reveal, SpotlightSurface } from "@/components/site/MotionPrimitives";

const clauses = [
  {
    icon: "fa-solid fa-code-branch",
    title: "Layanan Unofficial",
    body: "Website ini merupakan layanan unofficial yang dibuat oleh Nimzz dan bukan merupakan website resmi Alight Motion atau Alight Creative.",
  },
  {
    icon: "fa-solid fa-ban",
    title: "Gratis & Tidak Dijual",
    body: "Layanan disediakan secara gratis untuk pengguna dan tidak untuk diperjualbelikan.",
  },
  {
    icon: "fa-solid fa-server",
    title: "Ketersediaan Layanan",
    body: "Ketersediaan layanan bergantung pada API dan layanan pihak ketiga yang digunakan. Sistem dapat berubah atau berhenti berfungsi sewaktu-waktu.",
  },
];

export function Disclaimer() {
  return (
    <section aria-labelledby="disclaimer-title" className="container-page section-pad">
      <Reveal>
        <SpotlightSurface className="p-6 sm:p-8" interactive={false}>
          <div className="flex flex-col justify-between gap-2 border-b border-border pb-5 sm:flex-row sm:items-center">
            <h2 id="disclaimer-title" className="flex items-center gap-2.5 text-base font-semibold">
              <i className="fa-solid fa-circle-info text-primary" aria-hidden="true" />
              <span>Disclaimer</span>
            </h2>
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              INFORMASI LAYANAN
            </span>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {clauses.map((item) => (
              <div key={item.title} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <i className={`${item.icon} text-xs text-primary`} aria-hidden="true" />
                  <h3>{item.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </SpotlightSurface>
      </Reveal>
    </section>
  );
}
