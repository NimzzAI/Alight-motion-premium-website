import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { SpotlightSurface } from "@/components/site/MotionPrimitives";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendDonationProof } from "@/lib/donation.functions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function DonationForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [donorName, setDonorName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE) {
      toast.error("Ukuran foto terlalu besar. Maksimal 5MB.");
      e.target.value = "";
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      toast.error("Gunakan format JPG, PNG, atau WEBP.");
      e.target.value = "";
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!donorName.trim()) {
      toast.error("Isi nama atas donasi terlebih dahulu.");
      return;
    }
    if (!file) {
      toast.error("Unggah foto bukti transfer terlebih dahulu.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("proof", file);
      formData.append("donorName", donorName.trim());
      formData.append("note", note);

      const result = await sendDonationProof({ data: formData });

      if (result.ok) {
        setDone(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setDonorName("");
    setNote("");
    setDone(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (done) {
    return (
      <SpotlightSurface className="p-8 text-center" interactive={false}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/12 text-success">
          <i className="fa-solid fa-circle-check text-xl" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Terima Kasih Atas Dukungan Kamu
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Bukti transfer sudah diterima dengan baik. Kontribusi kamu membantu menjaga server dan
          layanan ini tetap aktif untuk seluruh pengguna.
        </p>
        <Button variant="outline" onClick={reset} className="motion-press mt-6 gap-2">
          <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
          <span>Kirim Bukti Lain</span>
        </Button>
      </SpotlightSurface>
    );
  }

  return (
    <SpotlightSurface className="p-6 sm:p-7" interactive={false}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-border bg-surface p-3.5 text-xs leading-relaxed text-muted-foreground">
          <p className="flex items-start gap-2.5">
            <i className="fa-solid fa-circle-info mt-0.5 text-primary" aria-hidden="true" />
            <span>
              Minimal donasi <strong className="font-semibold text-foreground">Rp1.000</strong> agar
              saldo QRIS dapat dicairkan. Mohon lampirkan tangkapan layar bukti transfer untuk
              konfirmasi.
            </span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="donorName">Nama Pengirim / Inisial</Label>
          <div className="relative">
            <i
              className="fa-regular fa-user pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xs text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="donorName"
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Nama kamu atau Anonim"
              maxLength={100}
              required
              className="flex h-10 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="proof">Bukti Transfer (JPG, PNG, WEBP · Maks 5MB)</Label>
          <input
            ref={inputRef}
            id="proof"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="sr-only"
            required
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="motion-press flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface/60 px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-surface"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-primary">
              <i className="fa-solid fa-cloud-arrow-up text-sm" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {file ? file.name : "Pilih atau unggah gambar bukti transfer"}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
                {file ? formatFileSize(file.size) : "Klik untuk membuka galeri perangkat"}
              </p>
            </div>
          </button>

          {preview && (
            <div className="animate-step-enter relative mt-3 overflow-hidden rounded-lg border border-border bg-surface p-2">
              <img
                src={preview}
                alt="Pratinjau bukti transfer"
                className="mx-auto max-h-60 rounded object-contain"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Pesan / Catatan Dukungan (Opsional)</Label>
          <Textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tulis pesan atau masukan untuk pengembangan layanan ini..."
            maxLength={500}
            rows={3}
            className="rounded-lg bg-background"
          />
        </div>

        <Button type="submit" disabled={submitting} className="motion-press w-full gap-2">
          <i
            className={
              submitting ? "fa-solid fa-spinner fa-spin text-xs" : "fa-solid fa-paper-plane text-xs"
            }
            aria-hidden="true"
          />
          <span>{submitting ? "Mengirim Bukti..." : "Kirim Konfirmasi Donasi"}</span>
        </Button>
      </form>
    </SpotlightSurface>
  );
}
