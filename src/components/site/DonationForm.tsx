import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendDonationProof } from "@/lib/donation.functions";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
      toast.error("Unggah foto bukti transfer terlebih dahulu. Bukti transfer wajib disertakan ya!");
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
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <h3 className="text-lg font-semibold text-foreground">Makasih banyak! 🥰💖</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Bukti transfer kamu udah sampai. Kebaikan kamu bikin layanan ini bisa terus jalan dan
            bantu lebih banyak orang lagi. Semoga rezekinya makin lancar ya!
          </p>
          <Button variant="outline" onClick={reset} className="mt-2">
            Kirim bukti lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm text-foreground">
            <i className="fa-solid fa-heart mr-1.5 text-primary" aria-hidden="true" />
            Bukti transfer <span className="font-semibold">wajib</span> dikirim ya, biar donasi
            kamu bisa langsung dicek dan diucapkan terima kasih dengan benar. Tanpa bukti, kami
            nggak bisa memverifikasi donasinya 🥺
          </div>

          <div className="space-y-2">
            <Label htmlFor="donorName">Atas nama</Label>
            <input
              id="donorName"
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Nama kamu atau nama panggilan"
              maxLength={100}
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proof">Foto bukti transfer (wajib)</Label>
            <input
              ref={inputRef}
              id="proof"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
              required
            />
            {preview && (
              <img
                src={preview}
                alt="Preview bukti transfer"
                className="mt-3 max-h-64 rounded-md border border-border object-contain"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Catatan / doa (opsional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Tulis pesan, semangat, atau doa buat Nimzz di sini~"
              maxLength={500}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Mengirim..." : "Kirim Bukti Transfer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
