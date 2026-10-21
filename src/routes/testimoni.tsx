import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState, type PointerEvent } from "react";
import { toast } from "sonner";

import { Reveal, SectionIndex, SpotlightSurface } from "@/components/site/MotionPrimitives";
import {
  MiniTestimonialCanvas,
  TestimonialCanvasStudio,
  type CanvasTheme,
} from "@/components/site/TestimonialCanvas";
import { Button } from "@/components/ui/button";
import { buildPageSeo } from "@/config/site";
import {
  getTestimonials,
  simulateLiveTestimonial,
  type TestimonialRecord,
} from "@/lib/testimonials.functions";

const description =
  "Live Canvas Testimoni aktivasi Alight Motion Premium secara real-time dengan perlindungan sensor privasi otomatis untuk email, UID, dan Order ID.";

export const Route = createFileRoute("/testimoni")({
  head: () =>
    buildPageSeo({
      title: "Live Testimoni Canvas — Alight Motion Premium Creator",
      description,
      path: "/testimoni",
    }),
  component: TestimoniPage,
});

function formatRelativeTime(iso: string): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 45) return "Baru saja";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

// Spatial coordinates for cards on the interactive canvas board
const BOARD_POSITIONS = [
  { x: 24, y: 24, rotate: -0.6 },
  { x: 470, y: 32, rotate: 0.7 },
  { x: 916, y: 24, rotate: -0.5 },
  { x: 48, y: 315, rotate: 0.5 },
  { x: 492, y: 322, rotate: -0.8 },
  { x: 936, y: 312, rotate: 0.6 },
  { x: 28, y: 605, rotate: -0.4 },
  { x: 478, y: 610, rotate: 0.5 },
];

function TestimoniPage() {
  const queryClient = useQueryClient();
  const fetchFeed = useServerFn(getTestimonials);
  const triggerSimulate = useServerFn(simulateLiveTestimonial);

  const [viewMode, setViewMode] = useState<"board" | "grid">("board");
  const [boardTheme, setBoardTheme] = useState<CanvasTheme>("obsidian");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Interactive spatial canvas pan & zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const feedQuery = useQuery({
    queryKey: ["testimonials-feed"],
    queryFn: () => fetchFeed(),
    refetchInterval: 5000,
    staleTime: 3000,
  });

  const simulateMutation = useMutation({
    mutationFn: () => triggerSimulate({ data: {} }),
    onSuccess: (newRecord) => {
      void queryClient.invalidateQueries({ queryKey: ["testimonials-feed"] });
      setSelectedId(newRecord.id);
      toast.success(`Aktivasi baru masuk: ${newRecord.maskedEmail}`);
    },
  });

  const records = feedQuery.data?.records ?? [];
  const activeRecord: TestimonialRecord | undefined =
    records.find((r) => r.id === selectedId) ?? records[0];

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.max(-680, Math.min(320, dragStartRef.current.panX + dx)),
      y: Math.max(-520, Math.min(240, dragStartRef.current.panY + dy)),
    });
  }

  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }

  function resetCanvasViewport() {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }

  return (
    <section className="container-page pt-10 pb-16 sm:pt-14">
      {/* Header */}
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <SectionIndex
            index="LIVE CANVAS"
            label="Bukti Aktivasi Real-Time"
            detail="Sensor Privasi Otomatis"
          />
          <h1 className="mt-2.5 text-3xl font-semibold sm:text-4xl">Canvas Testimoni Aktivasi</h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Setiap aktivasi Alight Motion Pro yang berhasil diverifikasi otomatis digambarkan ke
            dalam kartu HTML5 Canvas secara real-time. Seluruh data sensitif pengguna seperti alamat
            email, UID, dan nomor Order GPA disensor otomatis demi menjaga privasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => simulateMutation.mutate()}
            disabled={simulateMutation.isPending}
            className="motion-press gap-2"
          >
            <i
              className={
                simulateMutation.isPending
                  ? "fa-solid fa-spinner fa-spin text-xs"
                  : "fa-solid fa-bolt text-xs text-primary"
              }
              aria-hidden="true"
            />
            <span>Simulasikan Aktivasi Masuk</span>
          </Button>

          <Button asChild size="sm" className="motion-press gap-2">
            <Link to="/aktivasi">
              <i className="fa-solid fa-key text-xs" aria-hidden="true" />
              <span>Aktivasi Akun Kamu</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Live Telemetry Bar */}
      <Reveal className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-3.5 text-xs shadow-soft">
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <i className="fa-solid fa-satellite-dish text-success" aria-hidden="true" />
              <span>Sinkronisasi Live Aktif (Auto-Refresh 5 dtk)</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Total Tercatat: {feedQuery.data?.totalCount ?? "—"} Aktivasi
            </span>
            <span aria-hidden="true">·</span>
            <span>Proteksi PII: Email, UID &amp; Order ID Disensor</span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`motion-press inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "board"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <i className="fa-solid fa-vector-square text-[11px]" aria-hidden="true" />
              <span>Papan Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`motion-press inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <i className="fa-solid fa-table-cells-large text-[11px]" aria-hidden="true" />
              <span>Galeri Kartu</span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* Interactive Spatial Canvas Board Mode */}
      {viewMode === "board" && (
        <Reveal className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
            {/* Canvas Board Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface/70 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <i className="fa-solid fa-hand-pointer text-primary" aria-hidden="true" />
                <span>
                  Geser (drag) area kanvas untuk menjelajahi kartu bukti aktivasi, atau klik kartu
                  untuk memperbesar.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
                  {(["obsidian", "alabaster", "blueprint"] as CanvasTheme[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBoardTheme(t)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize transition-colors ${
                        boardTheme === t
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 font-mono text-[11px] tabular-nums">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.1).toFixed(2)))}
                    className="px-1.5 text-muted-foreground hover:text-foreground"
                    aria-label="Perkecil kanvas"
                  >
                    <i className="fa-solid fa-minus" aria-hidden="true" />
                  </button>
                  <span className="px-1">{Math.round(zoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(1.25, +(z + 0.1).toFixed(2)))}
                    className="px-1.5 text-muted-foreground hover:text-foreground"
                    aria-label="Perbesar kanvas"
                  >
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetCanvasViewport}
                  className="motion-press rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  <i className="fa-solid fa-compress mr-1" aria-hidden="true" />
                  Reset Posisi
                </button>
              </div>
            </div>

            {/* Draggable Spatial Viewport */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`bg-studio-grid relative h-[520px] w-full overflow-hidden select-none sm:h-[600px] ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
            >
              <div
                className="origin-top-left transition-transform duration-75 ease-out"
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                }}
              >
                {records.slice(0, 8).map((item, idx) => {
                  const pos = BOARD_POSITIONS[idx % BOARD_POSITIONS.length]!;
                  const isSelected = activeRecord?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rotate}deg)`,
                      }}
                      className="absolute top-0 left-0 w-[410px] transition-transform duration-300 ease-out hover:z-20 hover:scale-[1.03]"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={`block w-full rounded-2xl p-1.5 text-left transition-all ${
                          isSelected
                            ? "ring-2 ring-primary bg-primary/10 shadow-lift"
                            : "hover:ring-1 hover:ring-primary/50"
                        }`}
                      >
                        <div className="mb-1.5 flex items-center justify-between px-2 font-mono text-[11px] text-muted-foreground tabular-nums">
                          <span className="flex items-center gap-1.5 font-semibold text-foreground">
                            <i
                              className="fa-solid fa-circle-check text-success"
                              aria-hidden="true"
                            />
                            <span>{item.maskedEmail}</span>
                          </span>
                          <span>{formatRelativeTime(item.activatedAt)}</span>
                        </div>
                        <MiniTestimonialCanvas record={item} theme={boardTheme} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Grid Feed Mode */}
      {viewMode === "grid" && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {records.map((item, idx) => {
            const isSelected = activeRecord?.id === item.id;
            return (
              <Reveal key={item.id} delay={idx * 60}>
                <SpotlightSurface className={`p-4 sm:p-5 ${isSelected ? "border-primary" : ""}`}>
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-success" aria-hidden="true" />
                      <span className="font-mono font-semibold text-foreground">
                        {item.maskedEmail}
                      </span>
                    </div>
                    <span className="font-mono text-muted-foreground tabular-nums">
                      {formatRelativeTime(item.activatedAt)}
                    </span>
                  </div>

                  <MiniTestimonialCanvas record={item} theme={boardTheme} />

                  <div className="mt-3 flex items-center justify-between pt-1 text-xs text-muted-foreground">
                    <span className="font-mono tabular-nums">Order: {item.maskedOrderId}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                      }}
                      className="font-medium text-primary hover:underline"
                    >
                      Buka di Studio Canvas
                    </button>
                  </div>
                </SpotlightSurface>
              </Reveal>
            );
          })}
        </div>
      )}

      {/* High-Res HTML5 Canvas Inspector & Downloader */}
      {activeRecord && (
        <Reveal className="mt-12">
          <div className="grid items-start gap-8 border-t border-border pt-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionIndex index="STUDIO CANVAS" label="Inspektur & Unduh Kartu Bukti" />
              <h2 className="mt-2.5 text-2xl font-semibold">Pratinjau Resolusi Tinggi</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Kartu di samping digambar langsung menggunakan elemen HTML5{" "}
                <code className="font-mono text-xs text-foreground">&lt;canvas&gt;</code> seperti
                bukti aktivasi otomatis di Telegram, lengkap dengan sensor privasi pada alamat
                email, UID, dan nomor Order GPA.
              </p>

              <dl className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">ID Transmisi</dt>
                  <dd className="font-mono font-semibold text-foreground tabular-nums">
                    #{activeRecord.id}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email (Disensor)</dt>
                  <dd className="font-mono font-semibold text-foreground">
                    {activeRecord.maskedEmail}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Order ID (Disensor)</dt>
                  <dd className="font-mono font-semibold text-foreground tabular-nums">
                    {activeRecord.maskedOrderId}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">UID (Disensor)</dt>
                  <dd className="font-mono font-semibold text-foreground tabular-nums">
                    {activeRecord.maskedUid}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <dt className="text-muted-foreground">Berlaku Hingga</dt>
                  <dd className="font-mono font-semibold text-success tabular-nums">
                    {activeRecord.validUntil}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-8">
              <TestimonialCanvasStudio record={activeRecord} defaultTheme={boardTheme} />
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
