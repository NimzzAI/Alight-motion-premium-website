import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SignalPipeline, SpotlightSurface } from "@/components/site/MotionPrimitives";
import { TestimonialCanvasStudio } from "@/components/site/TestimonialCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiInfo } from "@/hooks/use-api-status";
import { sendMagicLink, verifyMagicLink, type ActionResult } from "@/lib/am-api.functions";
import {
  maskEmail,
  maskOrderId,
  maskUid,
  type TestimonialRecord,
} from "@/lib/testimonials.functions";

const LINK_LIFETIME_SECONDS = 5 * 60;
const ACTIVATION_STORAGE_KEY = "am_activation_state";

type Step = 1 | 2 | 3 | 4 | 5;

type PersistedState = {
  step: Step;
  email: string;
  magicLink: string;
  linkSentAt: number | null;
  sendResult: ActionResult | null;
  verifyResult: ActionResult | null;
};

function loadPersistedState(): Partial<PersistedState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ACTIVATION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePersistedState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota / privacy-mode errors
  }
}

function clearPersistedState() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACTIVATION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

const stepMeta: Record<Step, { title: string; short: string; icon: string }> = {
  1: { title: "Masukkan Email", short: "Email", icon: "fa-solid fa-envelope" },
  2: { title: "Kirim Link", short: "Kirim Link", icon: "fa-solid fa-paper-plane" },
  3: { title: "Cek Email", short: "Cek Email", icon: "fa-solid fa-inbox" },
  4: { title: "Salin Magic Link", short: "Salin Link", icon: "fa-solid fa-link" },
  5: {
    title: "Masukkan Magic Link & Verifikasi",
    short: "Verifikasi",
    icon: "fa-solid fa-shield-halved",
  },
};

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Notice({
  tone,
  children,
}: {
  tone: "info" | "warning" | "error";
  children: React.ReactNode;
}) {
  const toneClass = {
    info: "border-border bg-surface text-muted-foreground",
    warning: "border-warning/35 bg-warning/8 text-warning-foreground",
    error: "border-destructive/35 bg-destructive/8 text-destructive",
  }[tone];
  const icon = {
    info: "fa-solid fa-circle-info text-primary",
    warning: "fa-solid fa-triangle-exclamation text-warning",
    error: "fa-solid fa-circle-exclamation text-destructive",
  }[tone];

  return (
    <div
      className={`flex gap-3 rounded-xl border p-3.5 text-xs leading-relaxed sm:text-sm ${toneClass}`}
    >
      <i className={`${icon} mt-0.5 shrink-0`} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}

function CountdownBanner({
  secondsLeft,
  linkExpired,
}: {
  secondsLeft: number;
  linkExpired: boolean;
}) {
  const progress = Math.max(0, Math.min(1, secondsLeft / LINK_LIFETIME_SECONDS));

  return (
    <div
      className={`overflow-hidden rounded-xl border p-4 text-xs sm:text-sm ${
        linkExpired
          ? "border-destructive/40 bg-destructive/8 text-destructive"
          : "border-border bg-surface text-foreground"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2.5 font-medium">
          <i
            className={
              linkExpired
                ? "fa-solid fa-circle-exclamation text-destructive"
                : "fa-regular fa-clock text-primary"
            }
            aria-hidden="true"
          />
          <span>
            {linkExpired
              ? "Magic link sudah kedaluwarsa. Kirim ulang link untuk mendapatkan yang baru."
              : "Magic link berlaku selama 5 menit sejak dikirim:"}
          </span>
        </span>
        {!linkExpired && (
          <span className="font-mono text-sm font-semibold text-primary tabular-nums">
            {formatCountdown(secondsLeft)}
          </span>
        )}
      </div>
      {!linkExpired && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full w-full origin-left bg-primary transition-transform duration-500 ease-linear"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      )}
    </div>
  );
}

export function ActivationFlow() {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [email, setEmail] = useState("");
  const [magicLink, setMagicLink] = useState("");
  const [sendResult, setSendResult] = useState<ActionResult | null>(null);
  const [verifyResult, setVerifyResult] = useState<ActionResult | null>(null);
  const [linkSentAt, setLinkSentAt] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [hydrated, setHydrated] = useState(false);

  const info = useApiInfo();
  const send = useServerFn(sendMagicLink);
  const verify = useServerFn(verifyMagicLink);

  const elapsedSeconds = linkSentAt === null ? 0 : Math.floor((nowTick - linkSentAt) / 1000);
  const secondsLeft = Math.max(LINK_LIFETIME_SECONDS - elapsedSeconds, 0);
  const linkExpired = linkSentAt !== null && secondsLeft === 0;

  function goToStep(next: Step) {
    setDirection(next >= step ? "forward" : "back");
    setStep(next);
  }

  useEffect(() => {
    const persisted = loadPersistedState();
    if (persisted) {
      if (persisted.step) setStep(persisted.step);
      if (persisted.email) setEmail(persisted.email);
      if (persisted.magicLink) setMagicLink(persisted.magicLink);
      if (persisted.linkSentAt) setLinkSentAt(persisted.linkSentAt);
      if (persisted.sendResult) setSendResult(persisted.sendResult);
      if (persisted.verifyResult) setVerifyResult(persisted.verifyResult);
      if (persisted.linkSentAt) setNowTick(Date.now());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (linkSentAt === null || linkExpired) return;
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [linkSentAt, linkExpired]);

  useEffect(() => {
    if (!hydrated) return;
    if (verifyResult?.ok) {
      clearPersistedState();
      return;
    }
    savePersistedState({ step, email, magicLink, linkSentAt, sendResult, verifyResult });
  }, [hydrated, step, email, magicLink, linkSentAt, sendResult, verifyResult]);

  const sendMutation = useMutation({
    mutationFn: (value: string) => send({ data: { email: value } }),
    onSuccess: (result) => {
      setSendResult(result);
      if (result.ok) {
        setLinkSentAt(Date.now());
        setNowTick(Date.now());
        goToStep(3);
      }
    },
    onError: () =>
      setSendResult({
        ok: false,
        message: "Permintaan gagal dikirim. Periksa koneksi internet kamu lalu coba lagi.",
      }),
  });

  const verifyMutation = useMutation({
    mutationFn: (values: { email: string; magicLink: string }) => verify({ data: values }),
    onSuccess: (result) => setVerifyResult(result),
    onError: () =>
      setVerifyResult({
        ok: false,
        message: "Permintaan gagal dikirim. Periksa koneksi internet kamu lalu coba lagi.",
      }),
  });

  function restartFlow() {
    goToStep(1);
    setMagicLink("");
    setSendResult(null);
    setVerifyResult(null);
    setLinkSentAt(null);
    clearPersistedState();
  }

  async function handlePasteMagicLink() {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setMagicLink(text.trim());
        toast.success("Magic link berhasil ditempel.");
      } else {
        toast.error("Clipboard masih kosong.");
      }
    } catch {
      toast.error("Izin clipboard ditolak browser. Silakan tahan kolom lalu pilih Tempel manual.");
    }
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  if (verifyResult?.ok) {
    return (
      <SuccessCard
        result={verifyResult}
        fallbackBenefits={info.data?.benefits}
        onReset={restartFlow}
      />
    );
  }

  const stepProgress = (step - 1) / 4;

  return (
    <div
      className={`space-y-6 transition-opacity duration-300 ${hydrated ? "opacity-100" : "opacity-0"}`}
    >
      {/* Smooth Animated Stepper Bar */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Progres Aktivasi</span>
          <span className="font-mono tabular-nums">Step {step} dari 5</span>
        </div>

        <div className="relative mb-4 h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full w-full origin-left bg-primary transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${stepProgress})` }}
          />
        </div>

        <ol className="grid grid-cols-5 gap-1.5 sm:gap-2.5" aria-label="Langkah aktivasi">
          {([1, 2, 3, 4, 5] as Step[]).map((value) => {
            const active = step === value;
            const completed = step > value;
            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => goToStep(value)}
                  className={`motion-press flex w-full flex-col items-start gap-1.5 rounded-xl border p-2.5 text-left sm:p-3 ${
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : completed
                        ? "border-border bg-surface text-foreground hover:border-primary/40"
                        : "border-border bg-card text-muted-foreground hover:bg-surface/60"
                  }`}
                  aria-current={active ? "step" : undefined}
                  aria-label={`Step ${value}: ${stepMeta[value].title}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        active
                          ? "text-primary-foreground"
                          : completed
                            ? "text-success"
                            : "text-muted-foreground"
                      }`}
                    >
                      0{value}
                    </span>
                    <i
                      className={`${
                        completed && !active
                          ? "fa-solid fa-check text-success"
                          : stepMeta[value].icon
                      } text-xs ${active ? "text-primary-foreground" : "text-muted-foreground"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="hidden truncate text-xs font-medium sm:block">
                    {stepMeta[value].short}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Directional 60fps Animated Step Card */}
      <SpotlightSurface
        key={step}
        className={`${
          direction === "forward" ? "animate-step-enter" : "animate-step-back"
        } p-6 sm:p-8`}
        interactive={false}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <p className="font-mono text-xs font-semibold text-primary tabular-nums">
              STEP 0{step}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              {stepMeta[step].title}
            </h2>
          </div>
          {emailValid && (
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              <i className="fa-regular fa-envelope mr-1.5 text-primary" aria-hidden="true" />
              {email.trim()}
            </span>
          )}
        </div>

        {step === 1 && (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Masukkan email yang ingin kamu gunakan pada kolom email di bawah.
            </p>

            <div className="space-y-2">
              <Label htmlFor="email-step1">Email</Label>
              <div className="relative">
                <i
                  className="fa-regular fa-envelope pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xs text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email-step1"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="nama@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && emailValid) {
                      event.preventDefault();
                      goToStep(2);
                    }
                  }}
                  className="h-11 pl-9"
                />
              </div>
              {!emailValid && email.length > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                  <span>Format email belum benar. Contoh yang benar: nama@gmail.com</span>
                </p>
              )}
            </div>

            <Notice tone="warning">
              Gunakan email yang benar-benar bisa kamu akses karena link akan dikirim ke email
              tersebut.
            </Notice>

            <div className="pt-1">
              <Button
                disabled={!emailValid}
                onClick={() => goToStep(2)}
                className="motion-press gap-2 px-5"
              >
                <span>Lanjut ke Step 2</span>
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tekan tombol Kirim Link. Website akan meminta layanan mengirim email verifikasi ke
              alamat kamu.
            </p>

            <SignalPipeline compact />

            <div className="space-y-2">
              <Label htmlFor="email-step2">Email</Label>
              <Input
                id="email-step2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@gmail.com"
                className="h-11"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button
                disabled={!emailValid || sendMutation.isPending}
                onClick={() => sendMutation.mutate(email.trim())}
                className="motion-press gap-2 px-5"
              >
                {sendMutation.isPending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden="true" />
                    <span>Mengirim link...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane text-xs" aria-hidden="true" />
                    <span>Kirim Link</span>
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => goToStep(1)} className="motion-press gap-2">
                <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
                <span>Kembali</span>
              </Button>
            </div>

            {sendResult && !sendResult.ok && (
              <Notice tone="error">
                {sendResult.message}
                {sendResult.code ? ` (${sendResult.code})` : ""}
              </Notice>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 space-y-5">
            {sendResult?.ok && (
              <Notice tone="info">Link berhasil dikirim. Sekarang buka inbox email kamu.</Notice>
            )}

            {linkSentAt !== null && (
              <CountdownBanner secondsLeft={secondsLeft} linkExpired={linkExpired} />
            )}

            <ol className="space-y-3 rounded-xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-muted-foreground">
              <li>1. Buka aplikasi Gmail atau email provider kamu.</li>
              <li>2. Cari email yang berhubungan dengan layanan ini.</li>
              <li>
                3. Jika tidak menemukan email, periksa folder: Inbox, Spam, Promotions, dan Junk.
              </li>
              <li>4. Tunggu beberapa saat jika email belum muncul.</li>
            </ol>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button onClick={() => goToStep(4)} className="motion-press gap-2 px-5">
                <i className="fa-solid fa-envelope-open-text text-xs" aria-hidden="true" />
                <span>Email Sudah Ditemukan</span>
              </Button>
              <Button
                variant="outline"
                disabled={sendMutation.isPending}
                onClick={() => sendMutation.mutate(email.trim())}
                className="motion-press gap-2"
              >
                <i
                  className={
                    sendMutation.isPending
                      ? "fa-solid fa-spinner fa-spin text-xs"
                      : "fa-solid fa-rotate-right text-xs"
                  }
                  aria-hidden="true"
                />
                <span>{sendMutation.isPending ? "Mengirim..." : "Kirim ulang link"}</span>
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Magic link adalah link khusus yang dikirim melalui email untuk proses verifikasi.
            </p>

            {linkSentAt !== null && (
              <CountdownBanner secondsLeft={secondsLeft} linkExpired={linkExpired} />
            )}

            <ol className="space-y-3 rounded-xl border border-border bg-surface/50 p-4 text-sm leading-relaxed text-muted-foreground">
              <li>1. Buka email yang kamu terima.</li>
              <li>2. Cari tulisan biru &ldquo;Sign in to Alight Creative&rdquo; di dalam email.</li>
              <li>
                3. Tahan (tap lama) tulisan tersebut lalu pilih &ldquo;Salin URL&rdquo;. Jangan
                langsung diklik.
              </li>
              <li>4. Jangan membagikan link kepada orang lain.</li>
            </ol>

            <Notice tone="warning">
              Jangan membagikan magic link atau informasi akun kepada orang lain.
            </Notice>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button onClick={() => goToStep(5)} className="motion-press gap-2 px-5">
                <span>Lanjut ke Step 5</span>
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
              </Button>
              <Button variant="outline" onClick={() => goToStep(3)} className="motion-press">
                Kembali
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <form
            className="mt-6 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              verifyMutation.mutate({ email: email.trim(), magicLink: magicLink.trim() });
            }}
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Paste link yang tadi kamu salin ke kolom Magic Link, lalu tekan Verifikasi &amp;
              Aktivasi.
            </p>

            {linkSentAt !== null && (
              <CountdownBanner secondsLeft={secondsLeft} linkExpired={linkExpired} />
            )}

            <div className="space-y-2">
              <Label htmlFor="email-step5">Email</Label>
              <Input
                id="email-step5"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@gmail.com"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="magic-link">Magic Link</Label>
                <button
                  type="button"
                  onClick={() => void handlePasteMagicLink()}
                  className="motion-press inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <i className="fa-regular fa-clipboard" aria-hidden="true" />
                  <span>Tempel dari Clipboard</span>
                </button>
              </div>
              <Input
                id="magic-link"
                value={magicLink}
                onChange={(event) => setMagicLink(event.target.value)}
                placeholder="Paste link di sini"
                autoComplete="off"
                spellCheck={false}
                className="h-11 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button
                type="submit"
                disabled={!emailValid || magicLink.trim().length < 10 || verifyMutation.isPending}
                className="motion-press gap-2 px-5"
              >
                {verifyMutation.isPending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden="true" />
                    <span>Memeriksa link... Memproses verifikasi...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-shield-halved text-xs" aria-hidden="true" />
                    <span>Verifikasi &amp; Aktivasi</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => goToStep(4)}
                className="motion-press"
              >
                Kembali
              </Button>
            </div>

            {verifyResult && !verifyResult.ok && (
              <Notice tone="error">
                {verifyResult.message}
                {verifyResult.code ? ` (${verifyResult.code})` : ""}
              </Notice>
            )}

            {verifyResult &&
              !verifyResult.ok &&
              (verifyResult.code === "INVALID_OOB_CODE" ||
                verifyResult.code === "EXPIRED_OOB_CODE") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={restartFlow}
                  className="motion-press w-full gap-2"
                >
                  <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
                  <span>Ulang dari awal</span>
                </Button>
              )}
          </form>
        )}
      </SpotlightSurface>
    </div>
  );
}

function SuccessCard({
  result,
  fallbackBenefits,
  onReset,
}: {
  result: ActionResult;
  fallbackBenefits?: string[] | undefined;
  onReset: () => void;
}) {
  const benefits = result.data?.benefits ?? fallbackBenefits ?? [];

  async function copyAccountDetails() {
    const summary = [
      `Email: ${result.data?.email ?? "-"}`,
      `UID: ${result.data?.uid ?? "-"}`,
      `Order ID: ${result.data?.orderId ?? "-"}`,
      `Plan: ${result.data?.plan ?? "-"}${result.data?.duration ? ` (${result.data.duration})` : ""}`,
      `Berlaku s/d: ${result.data?.validUntil ?? "-"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Detail aktivasi berhasil disalin.");
    } catch {
      toast.error("Gagal menyalin ke clipboard.");
    }
  }

  const canvasRecord: TestimonialRecord = {
    id: "AM-VERIFIED",
    maskedEmail: maskEmail(result.data?.email),
    maskedUid: maskUid(result.data?.uid),
    maskedOrderId: maskOrderId(result.data?.orderId),
    plan: result.data?.plan ?? "Alight Motion Pro / Member",
    licenseType: "Yearly VIP License",
    productId: "am.full.sub.annual.19q4",
    duration: result.data?.duration ?? "1 Tahun",
    validUntil: result.data?.validUntil ?? "Aktif 1 Tahun",
    activatedAt: new Date().toISOString(),
    source: "live",
  };

  return (
    <div className="animate-fade-up space-y-6">
      <SpotlightSurface className="border-success/35 p-6 sm:p-8" interactive={false}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <p className="flex items-center gap-2.5 text-lg font-semibold">
            <i className="fa-solid fa-circle-check text-success" aria-hidden="true" />
            <span>Aktivasi Berhasil</span>
          </p>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void copyAccountDetails()}
              className="motion-press gap-2"
            >
              <i className="fa-regular fa-copy text-xs" aria-hidden="true" />
              <span>Salin Detail</span>
            </Button>
            <Button asChild size="sm" className="motion-press gap-2">
              <Link to="/testimoni">
                <i className="fa-solid fa-vector-square text-xs" aria-hidden="true" />
                <span>Lihat di Canvas Testimoni</span>
              </Link>
            </Button>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="mt-1 font-medium break-all text-foreground">
              {result.data?.email ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <dt className="text-xs text-muted-foreground">UID</dt>
            <dd className="mt-1 font-mono text-xs font-medium break-all text-foreground tabular-nums">
              {result.data?.uid ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <dt className="text-xs text-muted-foreground">Order ID</dt>
            <dd className="mt-1 font-mono text-xs font-medium break-all text-foreground tabular-nums">
              {result.data?.orderId ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-4">
            <dt className="text-xs text-muted-foreground">Berlaku s/d</dt>
            <dd className="mt-1 font-mono text-sm font-medium text-foreground tabular-nums">
              {result.data?.validUntil ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border bg-surface/60 p-4 sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Plan</dt>
            <dd className="mt-1 font-medium text-foreground">
              {result.data?.plan ?? "—"}
              {result.data?.duration ? ` · ${result.data.duration}` : ""}
            </dd>
          </div>
        </dl>

        {benefits.length > 0 && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-sm font-medium">Benefits</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <i className="fa-solid fa-check mt-1 text-success" aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-6">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Kartu Bukti Canvas (Data Sensitif Disensor Otomatis)
          </p>
          <TestimonialCanvasStudio record={canvasRecord} />
        </div>

        <div className="mt-6 space-y-4">
          <Notice tone="warning">
            Simpan informasi penting akun kamu dengan aman dan jangan membagikan credential apa pun
            kepada orang lain.
          </Notice>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            className="motion-press gap-2"
          >
            <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
            <span>Aktivasi Email Lain</span>
          </Button>
        </div>
      </SpotlightSurface>
    </div>
  );
}
