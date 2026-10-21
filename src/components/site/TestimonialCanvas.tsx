import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { TestimonialRecord } from "@/lib/testimonials.functions";

export type CanvasTheme = "obsidian" | "alabaster" | "blueprint";

const THEMES: Record<
  CanvasTheme,
  {
    label: string;
    bgStart: string;
    bgEnd: string;
    grid: string;
    surface: string;
    border: string;
    textPrimary: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
    success: string;
    successSoft: string;
    censorBar: string;
  }
> = {
  obsidian: {
    label: "Obsidian Dark",
    bgStart: "#0f1117",
    bgEnd: "#151923",
    grid: "rgba(255, 255, 255, 0.035)",
    surface: "rgba(255, 255, 255, 0.04)",
    border: "rgba(255, 255, 255, 0.11)",
    textPrimary: "#f8fafc",
    textMuted: "#94a3b8",
    accent: "#3b82f6",
    accentSoft: "rgba(59, 130, 246, 0.16)",
    success: "#10b981",
    successSoft: "rgba(16, 185, 129, 0.16)",
    censorBar: "rgba(59, 130, 246, 0.22)",
  },
  alabaster: {
    label: "Studio Light",
    bgStart: "#f9f8f5",
    bgEnd: "#f1efe9",
    grid: "rgba(15, 23, 42, 0.04)",
    surface: "#ffffff",
    border: "rgba(15, 23, 42, 0.11)",
    textPrimary: "#0f172a",
    textMuted: "#64748b",
    accent: "#254edb",
    accentSoft: "rgba(37, 78, 219, 0.1)",
    success: "#0d8a52",
    successSoft: "rgba(13, 138, 82, 0.12)",
    censorBar: "rgba(15, 23, 42, 0.1)",
  },
  blueprint: {
    label: "Cobalt Blueprint",
    bgStart: "#0b1933",
    bgEnd: "#0f2447",
    grid: "rgba(147, 197, 253, 0.06)",
    surface: "rgba(15, 36, 71, 0.75)",
    border: "rgba(147, 197, 253, 0.2)",
    textPrimary: "#f0f9ff",
    textMuted: "#93c5fd",
    accent: "#60a5fa",
    accentSoft: "rgba(96, 165, 250, 0.2)",
    success: "#34d399",
    successSoft: "rgba(52, 211, 153, 0.18)",
    censorBar: "rgba(96, 165, 250, 0.24)",
  },
};

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function formatWibTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Baru saja";
  return (
    date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    }) + " WIB"
  );
}

function drawRedactedValue(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  theme: (typeof THEMES)["obsidian"],
  strictCensor: boolean,
) {
  ctx.font = "600 18px 'JetBrains Mono', monospace";
  ctx.fillStyle = theme.textPrimary;

  if (!strictCensor) {
    ctx.fillText(text, x, y);
    // Draw subtle highlight pill behind the masked bullet section
    const bulletStart = text.indexOf("•");
    const bulletEnd = text.lastIndexOf("•");
    if (bulletStart !== -1 && bulletEnd >= bulletStart) {
      const prefixWidth = ctx.measureText(text.slice(0, bulletStart)).width;
      const maskWidth = ctx.measureText(text.slice(bulletStart, bulletEnd + 1)).width;
      ctx.save();
      ctx.fillStyle = theme.censorBar;
      drawRoundedRect(ctx, x + prefixWidth - 2, y - 16, maskWidth + 4, 21, 4);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = theme.textPrimary;
      ctx.fillText(text, x, y);
    }
    return;
  }

  // Strict censor mode: replace bullets with solid redaction block
  const bulletStart = text.indexOf("•");
  const bulletEnd = text.lastIndexOf("•");
  if (bulletStart === -1) {
    ctx.fillText(text, x, y);
    return;
  }
  const prefix = text.slice(0, bulletStart);
  const suffix = text.slice(bulletEnd + 1);
  ctx.fillText(prefix, x, y);
  const prefixWidth = ctx.measureText(prefix).width;
  const blockWidth = Math.max(76, ctx.measureText(text.slice(bulletStart, bulletEnd + 1)).width);

  ctx.save();
  ctx.fillStyle = theme.accent;
  ctx.globalAlpha = 0.28;
  drawRoundedRect(ctx, x + prefixWidth + 3, y - 15, blockWidth - 6, 18, 4);
  ctx.fill();
  ctx.restore();

  ctx.font = "600 10px 'JetBrains Mono', monospace";
  ctx.fillStyle = theme.accent;
  ctx.fillText("SENSOR", x + prefixWidth + 14, y - 3);

  ctx.font = "600 18px 'JetBrains Mono', monospace";
  ctx.fillStyle = theme.textPrimary;
  ctx.fillText(suffix, x + prefixWidth + blockWidth, y);
}

export function renderTestimonialToCanvas(
  canvas: HTMLCanvasElement,
  record: TestimonialRecord,
  themeKey: CanvasTheme = "obsidian",
  strictCensor = false,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = 960;
  const height = 540;
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 2;

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }

  ctx.save();
  ctx.scale(dpr, dpr);

  const t = THEMES[themeKey];

  // 1. Background Gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, t.bgStart);
  grad.addColorStop(1, t.bgEnd);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Architectural Grid Lines
  ctx.strokeStyle = t.grid;
  ctx.lineWidth = 1;
  const gridStep = 32;
  for (let gx = 0; gx < width; gx += gridStep) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
    ctx.stroke();
  }
  for (let gy = 0; gy < height; gy += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
  }

  // 3. Outer Frame Border
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 1.5;
  drawRoundedRect(ctx, 20, 20, width - 40, height - 40, 16);
  ctx.stroke();

  // 4. Header Section
  ctx.fillStyle = t.accentSoft;
  drawRoundedRect(ctx, 44, 44, 42, 42, 10);
  ctx.fill();

  // Draw Check Shield Vector in Header
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(65, 65, 11, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(60, 65);
  ctx.lineTo(63.5, 68.5);
  ctx.lineTo(71, 61);
  ctx.stroke();

  ctx.fillStyle = t.textPrimary;
  ctx.font = "700 20px 'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("ALIGHT MOTION PREMIUM CREATOR", 100, 62);

  ctx.fillStyle = t.textMuted;
  ctx.font = "500 12px 'JetBrains Mono', monospace";
  ctx.fillText(`BUKTI AKTIVASI REAL-TIME  ·  ID #${record.id}`, 100, 81);

  // Status Badge on Top Right
  const badgeW = 166;
  const badgeH = 34;
  const badgeX = width - 44 - badgeW;
  const badgeY = 48;
  ctx.fillStyle = t.successSoft;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 8);
  ctx.fill();
  ctx.strokeStyle = t.success;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 8);
  ctx.stroke();

  ctx.fillStyle = t.success;
  ctx.beginPath();
  ctx.arc(badgeX + 18, badgeY + 17, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "700 12px 'JetBrains Mono', monospace";
  ctx.fillText("PREMIUM AKTIF", badgeX + 32, badgeY + 21);

  // Header Divider
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(44, 106);
  ctx.lineTo(width - 44, 106);
  ctx.stroke();

  // 5. Left Column: Redacted User Identity Cards
  ctx.fillStyle = t.textMuted;
  ctx.font = "600 11px 'JetBrains Mono', monospace";
  ctx.fillText("IDENTITAS PENGGUNA (DISENSOR OTOMATIS)", 44, 134);

  const userFields = [
    { label: "EMAIL AKUN", value: record.maskedEmail, tag: "PRIVACY MASKED" },
    { label: "NOMOR ORDER (GPA)", value: record.maskedOrderId, tag: "ORDER REDACTED" },
    { label: "USER ID (UID)", value: record.maskedUid, tag: "UID PROTECTED" },
  ];

  userFields.forEach((field, idx) => {
    const cardY = 148 + idx * 92;
    const cardW = 436;
    const cardH = 78;

    ctx.fillStyle = t.surface;
    drawRoundedRect(ctx, 44, cardY, cardW, cardH, 12);
    ctx.fill();
    ctx.strokeStyle = t.border;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, 44, cardY, cardW, cardH, 12);
    ctx.stroke();

    ctx.fillStyle = t.textMuted;
    ctx.font = "500 11px 'JetBrains Mono', monospace";
    ctx.fillText(field.label, 62, cardY + 26);

    ctx.fillStyle = t.accent;
    ctx.font = "600 10px 'JetBrains Mono', monospace";
    const tagW = ctx.measureText(field.tag).width;
    ctx.fillText(field.tag, 44 + cardW - tagW - 18, cardY + 26);

    drawRedactedValue(ctx, field.value, 62, cardY + 56, t, strictCensor);
  });

  // 6. Right Column: Package & License Details
  const rightX = 502;
  const rightW = width - rightX - 44;

  ctx.fillStyle = t.textMuted;
  ctx.font = "600 11px 'JetBrains Mono', monospace";
  ctx.fillText("RINCIAN LISENSI & PAKET AKTIF", rightX, 134);

  // Main Package Card
  ctx.fillStyle = t.surface;
  drawRoundedRect(ctx, rightX, 148, rightW, 262, 12);
  ctx.fill();
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, rightX, 148, rightW, 262, 12);
  ctx.stroke();

  ctx.fillStyle = t.textMuted;
  ctx.font = "500 11px 'JetBrains Mono', monospace";
  ctx.fillText("NAMA PAKET", rightX + 22, 178);

  ctx.fillStyle = t.textPrimary;
  ctx.font = "700 21px 'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(record.plan, rightX + 22, 205);

  // Inner divider
  ctx.strokeStyle = t.border;
  ctx.beginPath();
  ctx.moveTo(rightX + 22, 224);
  ctx.lineTo(rightX + rightW - 22, 224);
  ctx.stroke();

  const specs = [
    { label: "TIPE LISENSI", val: record.licenseType },
    { label: "DURASI PAKET", val: record.duration },
    { label: "KODE PRODUK", val: record.productId },
    { label: "BERLAKU S/D", val: record.validUntil },
  ];

  specs.forEach((sp, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sx = rightX + 22 + col * 195;
    const sy = 252 + row * 72;

    ctx.fillStyle = t.textMuted;
    ctx.font = "500 11px 'JetBrains Mono', monospace";
    ctx.fillText(sp.label, sx, sy);

    ctx.fillStyle = t.textPrimary;
    ctx.font = "600 14px 'JetBrains Mono', monospace";
    ctx.fillText(sp.val, sx, sy + 24);
  });

  // 7. Footer Bar
  ctx.strokeStyle = t.border;
  ctx.beginPath();
  ctx.moveTo(44, 442);
  ctx.lineTo(width - 44, 442);
  ctx.stroke();

  ctx.fillStyle = t.textMuted;
  ctx.font = "500 12px 'JetBrains Mono', monospace";
  ctx.fillText(`WAKTU AKTIVASI: ${formatWibTime(record.activatedAt)}`, 44, 476);

  ctx.fillStyle = t.textMuted;
  ctx.font = "500 11px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Data sensitif pengguna disensor secara otomatis demi menjaga privasi.", 44, 496);

  // Verified Seal on Footer Right
  const sealText = "TERVERIFIKASI SISTEM NIMZZ";
  ctx.font = "600 11px 'JetBrains Mono', monospace";
  const sealW = ctx.measureText(sealText).width + 28;
  ctx.fillStyle = t.accentSoft;
  drawRoundedRect(ctx, width - 44 - sealW, 464, sealW, 28, 6);
  ctx.fill();
  ctx.fillStyle = t.accent;
  ctx.fillText(sealText, width - 44 - sealW + 14, 482);

  ctx.restore();
}

export function MiniTestimonialCanvas({
  record,
  theme = "obsidian",
  strictCensor = false,
  className = "",
}: {
  record: TestimonialRecord;
  theme?: CanvasTheme;
  strictCensor?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    renderTestimonialToCanvas(node, record, theme, strictCensor);
  }, [record, theme, strictCensor]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Kartu canvas testimoni aktivasi ${record.maskedEmail}`}
      className={`block h-auto w-full rounded-xl border border-border shadow-soft ${className}`}
    />
  );
}

export function TestimonialCanvasStudio({
  record,
  defaultTheme = "obsidian",
}: {
  record: TestimonialRecord;
  defaultTheme?: CanvasTheme;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [theme, setTheme] = useState<CanvasTheme>(defaultTheme);
  const [strictCensor, setStrictCensor] = useState(false);

  const redraw = useCallback(() => {
    const node = canvasRef.current;
    if (!node) return;
    renderTestimonialToCanvas(node, record, theme, strictCensor);
  }, [record, theme, strictCensor]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  function handleDownloadPng() {
    const node = canvasRef.current;
    if (!node) return;
    try {
      const dataUrl = node.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `testimoni-am-${record.id.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Gambar bukti Canvas berhasil diunduh.");
    } catch {
      toast.error("Gagal mengunduh gambar Canvas.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Theme Selector */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {(Object.keys(THEMES) as CanvasTheme[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTheme(key)}
              className={`motion-press rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                theme === key
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {THEMES[key].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStrictCensor((v) => !v)}
            className={`motion-press inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              strictCensor
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <i
              className={`fa-solid ${strictCensor ? "fa-eye-slash" : "fa-shield-halved"} text-xs`}
              aria-hidden="true"
            />
            <span>{strictCensor ? "Sensor Blok Penuh: Aktif" : "Mode Sensor Standar"}</span>
          </button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownloadPng}
            className="motion-press gap-2"
          >
            <i className="fa-solid fa-download text-xs" aria-hidden="true" />
            <span>Unduh PNG Canvas</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lift sm:p-3">
        <canvas
          ref={canvasRef}
          aria-label={`Canvas bukti aktivasi Alight Motion Pro untuk ${record.maskedEmail}`}
          className="block h-auto w-full rounded-xl"
        />
      </div>
    </div>
  );
}
