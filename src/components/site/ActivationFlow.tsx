import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiInfo } from "@/hooks/use-api-status";
import { sendMagicLink, verifyMagicLink, type ActionResult } from "@/lib/am-api.functions";

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

const stepTitles: Record<Step, string> = {
  1: "Masukkan Email",
  2: "Kirim Link",
  3: "Cek Email",
  4: "Salin Magic Link",
  5: "Masukkan Magic Link & Verifikasi",
};

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Notice({ tone, children }: { tone: "info" | "warning" | "error"; children: React.ReactNode }) {
  const toneClass = {
    info: "border-border bg-surface text-muted-foreground",
    warning: "border-warning/40 bg-warning/10 text-warning-foreground",
    error: "border-destructive/40 bg-destructive/8 text-destructive",
  }[tone];
  const icon = {
    info: "fa-solid fa-circle-info",
    warning: "fa-solid fa-triangle-exclamation",
    error: "fa-solid fa-circle-exclamation",
  }[tone];

  return (
    <p className={`flex gap-2.5 rounded-xl border p-3.5 text-sm leading-relaxed ${toneClass}`}>
      <i className={`${icon} mt-0.5 shrink-0`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export function ActivationFlow() {
  const [step, setStep] = useState<Step>(1);
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

  useEffect(() => {
    // Restore setelah mount (bukan saat init state) supaya HTML dari server
    // dan render pertama di client tetap sama persis — menghindari hydration mismatch.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (linkSentAt === null || linkExpired) return;
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [linkSentAt, linkExpired]);

  useEffect(() => {
    // Jangan simpan sebelum proses restore di atas selesai — kalau tidak,
    // render pertama (state default) bisa langsung menimpa data yang tersimpan.
    if (!hydrated) return;
    // Jangan simpan state kalau sudah berhasil verifikasi — flow selesai, biar
    // buka halaman ini lagi nanti mulai bersih dari step 1, bukan nyangkut di SuccessCard.
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
        setStep(3);
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
    setStep(1);
    setMagicLink("");
    setSendResult(null);
    setVerifyResult(null);
    setLinkSentAt(null);
    clearPersistedState();
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

  if (verifyResult?.ok) {
    return <SuccessCard result={verifyResult} fallbackBenefits={info.data?.benefits} />;
  }

  return (
    <div className={`space-y-6 transition-opacity duration-200 ${hydrated ? "opacity-100" : "opacity-0"}`}>
      <ol className="flex flex-wrap gap-2" aria-label="Langkah aktivasi">
        {([1, 2, 3, 4, 5] as Step[]).map((value) => (
          <li key={value}>
            <button
              type="button"
              onClick={() => setStep(value)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                step === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
              aria-current={step === value ? "step" : undefined}
              aria-label={`Step ${value}: ${stepTitles[value]}`}
            >
              {value}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step {step}</p>
        <h2 className="mt-1 text-xl font-semibold">{stepTitles[step]}</h2>

        {step === 1 && (
          <div className="mt-5 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Masukkan email yang ingin kamu gunakan pada kolom email di bawah.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email-step1">Email</Label>
              <Input
                id="email-step1"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nama@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Notice tone="warning">
              Gunakan email yang benar-benar bisa kamu akses karena link akan dikirim ke email
              tersebut.
            </Notice>
            <Button disabled={!emailValid} onClick={() => setStep(2)}>
              Lanjut ke Step 2
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Button>
            {!emailValid && email.length > 0 && (
              <p className="text-sm text-destructive">
                Format email belum benar. Contoh yang benar: nama@gmail.com
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tekan tombol Kirim Link. Website akan meminta layanan mengirim email verifikasi ke
              alamat kamu.
            </p>
            <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
              <pre className="font-sans leading-relaxed">{`Email
 ↓
Website
 ↓
API
 ↓
Email dikirim`}</pre>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-step2">Email</Label>
              <Input
                id="email-step2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@gmail.com"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={!emailValid || sendMutation.isPending}
                onClick={() => sendMutation.mutate(email.trim())}
              >
                {sendMutation.isPending ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                    Mengirim link...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                    Kirim Link
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                Kembali
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
          <div className="mt-5 space-y-5">
            {sendResult?.ok && (
              <Notice tone="info">Link berhasil dikirim. Sekarang buka inbox email kamu.</Notice>
            )}
            {linkSentAt !== null && (
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-sm ${
                  linkExpired
                    ? "border-destructive/40 bg-destructive/8 text-destructive"
                    : "border-warning/40 bg-warning/10 text-warning-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <i
                    className={linkExpired ? "fa-solid fa-circle-exclamation" : "fa-regular fa-clock"}
                    aria-hidden="true"
                  />
                  {linkExpired
                    ? "Magic link sudah kedaluwarsa. Kirim ulang link untuk mendapatkan yang baru."
                    : "Magic link berlaku selama 5 menit sejak dikirim."}
                </span>
                {!linkExpired && (
                  <span className="font-mono font-semibold tabular-nums">
                    {formatCountdown(secondsLeft)}
                  </span>
                )}
              </div>
            )}
            <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>1. Buka aplikasi Gmail atau email provider kamu.</li>
              <li>2. Cari email yang berhubungan dengan layanan ini.</li>
              <li>
                3. Jika tidak menemukan email, periksa folder: Inbox, Spam, Promotions, dan Junk.
              </li>
              <li>4. Tunggu beberapa saat jika email belum muncul.</li>
            </ol>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setStep(4)}>
                <i className="fa-solid fa-envelope-open-text" aria-hidden="true" />
                Email Sudah Ditemukan
              </Button>
              <Button
                variant="outline"
                disabled={sendMutation.isPending}
                onClick={() => sendMutation.mutate(email.trim())}
              >
                {sendMutation.isPending ? "Mengirim..." : "Kirim ulang link"}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-5 space-y-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Magic link adalah link khusus yang dikirim melalui email untuk proses verifikasi.
            </p>
            {linkSentAt !== null && (
              <div
                className={`flex items-center justify-between rounded-xl border p-3.5 text-sm ${
                  linkExpired
                    ? "border-destructive/40 bg-destructive/8 text-destructive"
                    : "border-warning/40 bg-warning/10 text-warning-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <i
                    className={linkExpired ? "fa-solid fa-circle-exclamation" : "fa-regular fa-clock"}
                    aria-hidden="true"
                  />
                  {linkExpired
                    ? "Magic link sudah kedaluwarsa. Kembali ke step sebelumnya dan kirim ulang."
                    : "Sisa waktu sebelum link kedaluwarsa (5 menit sejak dikirim):"}
                </span>
                {!linkExpired && (
                  <span className="font-mono font-semibold tabular-nums">
                    {formatCountdown(secondsLeft)}
                  </span>
                )}
              </div>
            )}
            <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>1. Buka email yang kamu terima.</li>
              <li>2. Cari link verifikasi di dalam email tersebut.</li>
              <li>3. Salin (copy) link tersebut. Jangan langsung dibuka jika tidak perlu.</li>
              <li>4. Jangan membagikan link kepada orang lain.</li>
            </ol>
            <Notice tone="warning">
              Jangan membagikan magic link atau informasi akun kepada orang lain.
            </Notice>
            <Button onClick={() => setStep(5)}>
              Lanjut ke Step 5
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Button>
          </div>
        )}

        {step === 5 && (
          <form
            className="mt-5 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              verifyMutation.mutate({ email: email.trim(), magicLink: magicLink.trim() });
            }}
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Paste link yang tadi kamu salin ke kolom Magic Link, lalu tekan Verifikasi &amp;
              Aktivasi.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email-step5">Email</Label>
              <Input
                id="email-step5"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="magic-link">Magic Link</Label>
              <Input
                id="magic-link"
                value={magicLink}
                onChange={(event) => setMagicLink(event.target.value)}
                placeholder="Paste link di sini"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <Button type="submit" disabled={!emailValid || magicLink.trim().length < 10 || verifyMutation.isPending}>
              {verifyMutation.isPending ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                  Memeriksa link... Memproses verifikasi...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                  Verifikasi &amp; Aktivasi
                </>
              )}
            </Button>
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
                <Button type="button" variant="outline" onClick={restartFlow} className="w-full">
                  <i className="fa-solid fa-rotate-left" aria-hidden="true" />
                  Ulang dari awal
                </Button>
              )}
          </form>
        )}
      </div>
    </div>
  );
}

function SuccessCard({
  result,
  fallbackBenefits,
}: {
  result: ActionResult;
  fallbackBenefits?: string[] | undefined;
}) {
  const benefits = result.data?.benefits ?? fallbackBenefits ?? [];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="rounded-2xl border border-success/30 bg-card p-6 shadow-soft sm:p-8">
        <p className="flex items-center gap-2.5 text-lg font-semibold">
          <i className="fa-solid fa-circle-check text-success" aria-hidden="true" />
          Aktivasi Berhasil
        </p>

        <dl className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="mt-0.5 font-medium break-all">{result.data?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">UID</dt>
            <dd className="mt-0.5 font-medium break-all">{result.data?.uid ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Order ID</dt>
            <dd className="mt-0.5 font-medium break-all">{result.data?.orderId ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Berlaku s/d</dt>
            <dd className="mt-0.5 font-medium">{result.data?.validUntil ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Plan</dt>
            <dd className="mt-0.5 font-medium">
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
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Notice tone="warning">
          Simpan informasi penting akun kamu dengan aman dan jangan membagikan credential apa pun
          kepada orang lain.
        </Notice>
      </div>
    </div>
  );
}
