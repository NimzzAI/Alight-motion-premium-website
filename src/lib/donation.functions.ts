import { createServerFn } from "@tanstack/react-start";

export type DonationResult = {
  ok: boolean;
  message: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function errorMessage(code: string): string {
  switch (code) {
    case "NO_FILE":
      return "Foto bukti transfer belum diunggah.";
    case "FILE_TOO_LARGE":
      return "Ukuran foto terlalu besar. Maksimal 5MB.";
    case "INVALID_TYPE":
      return "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.";
    case "SERVER_MISCONFIGURED":
      return "Layanan sedang tidak dapat menerima bukti transfer. Coba lagi nanti.";
    case "TELEGRAM_FAILED":
      return "Gagal mengirim bukti transfer. Coba lagi dalam beberapa saat.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
}

export const sendDonationProof = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("INVALID_INPUT");
    }
    return data;
  })
  .handler(async ({ data }): Promise<DonationResult> => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return { ok: false, message: errorMessage("SERVER_MISCONFIGURED") };
    }

    const file = data.get("proof");
    const donorNameRaw = data.get("donorName");
    const note = data.get("note");
    const donorName =
      typeof donorNameRaw === "string" && donorNameRaw.trim()
        ? donorNameRaw.trim().slice(0, 100)
        : "Anonim";
    const noteText = typeof note === "string" ? note.trim().slice(0, 500) : "";

    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: errorMessage("NO_FILE") };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { ok: false, message: errorMessage("FILE_TOO_LARGE") };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { ok: false, message: errorMessage("INVALID_TYPE") };
    }

    const caption = [
      "\u{1F49D} Donasi baru masuk!",
      `Atas nama: ${donorName}`,
      `Waktu: ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`,
      noteText ? `Catatan: ${noteText}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    const telegramForm = new FormData();
    telegramForm.append("chat_id", chatId);
    telegramForm.append("caption", caption);
    telegramForm.append("photo", file, file.name || "bukti-transfer.jpg");

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendPhoto`,
        { method: "POST", body: telegramForm, signal: AbortSignal.timeout(20000) },
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload?.ok !== true) {
        return { ok: false, message: errorMessage("TELEGRAM_FAILED") };
      }
    } catch {
      return { ok: false, message: errorMessage("TELEGRAM_FAILED") };
    }

    return { ok: true, message: "Bukti transfer berhasil dikirim. Terima kasih atas donasinya!" };
  });
