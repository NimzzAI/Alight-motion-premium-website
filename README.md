![Alight Motion Premium Creator](public/images/og-image.jpg)

# Alight Motion Premium Creator

**Layanan gratis & unofficial** untuk aktivasi Alight Motion Premium, dibuat oleh **Nimzz**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/status-unofficial-lightgrey)

> Gratis • Unofficial • Not for Resale — bukan produk resmi Alight Creative.

---

## Daftar Isi

- [Tentang](#tentang)
- [Fitur & Halaman](#fitur--halaman)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Struktur Folder](#struktur-folder)
- [Kustomisasi](#kustomisasi)
- [Catatan Keamanan](#catatan-keamanan)
- [Disclaimer](#disclaimer)
- [Lisensi](#lisensi)

---

## Tentang

Website ini adalah **frontend** untuk API aktivasi Alight Motion Premium yang sudah tersedia di
`https://am-premium-nimzz.vercel.app`. Website hanya mengintegrasikan endpoint resmi API
tersebut: mengirim *magic link* ke email pengguna, lalu memverifikasinya untuk mengaktifkan
status Premium.

Dibangun dengan **React 19 + TanStack Start (SSR)**, dan dilengkapi asisten chat AI ("Nimzz AI")
untuk membantu pengguna yang stuck di tengah proses aktivasi.

## Fitur & Halaman

| Route | Deskripsi |
|---|---|
| `/` | Landing page — ringkasan layanan, checklist syarat, quick FAQ |
| `/aktivasi` | Alur aktivasi 5 langkah (input email → kirim link → salin magic link → verifikasi → selesai) |
| `/panduan` | Panduan step-by-step lengkap dengan screenshot, untuk pemula |
| `/troubleshooting` | Solusi error umum: email tidak masuk, `INVALID_EMAIL`, `INVALID_OOB_CODE`, `EXPIRED_OOB_CODE`, `TOO_MANY_ATTEMPTS`, API offline, dll |
| `/faq` | Pertanyaan yang sering ditanyakan |
| `/status` | Cek status API (online/offline, versi, uptime) + info paket |
| `/sistem` | Penjelasan cara kerja sistem & alur data |
| `/donasi` | Donasi sukarela via QRIS + upload bukti transfer (dikirim ke Telegram) |
| `/api/nimzz-ai` | Endpoint chat streaming untuk asisten "Nimzz AI" |

**Nimzz AI** — chatbot bawaan (`NimzzAI.tsx`) yang fokus bantu user yang stuck (paling sering di
step "cari magic link di email"), dilengkapi filter kata kasar, filter anti-jailbreak, dan rate
limit per-IP di sisi server.

## Tech Stack

- **React 19** + **TanStack Start** (SSR) + **TanStack Router**
- **Vite 8** + **Nitro** sebagai server runtime
- **TailwindCSS v4** + **shadcn/ui** (Radix primitives)
- **Zod** + **React Hook Form** untuk validasi & form
- **TanStack Query** untuk data fetching (status API)
- **Recharts**, **Sonner** (toast), **Vaul** (drawer)
- **Font Awesome** (ikon, via CDN)
- Package manager: **npm** (skrip utama di `package.json`); `bunfig.toml` tersedia kalau mau pakai **Bun**

## Prasyarat

- Node.js 20+ atau Bun terbaru
- (Opsional) Bot Telegram sendiri jika ingin fitur donasi aktif di instance kamu

## Instalasi

```bash
git clone https://github.com/NimzzAI/Alight-motion-premium-website.git
cd am-premium-website
npm install
```

## Environment Variables

Salin `.env.example` menjadi `.env`, lalu isi sesuai kebutuhan:

| Variable | Wajib? | Secret? | Keterangan |
|---|---|---|---|
| `VITE_API_BASE_URL` | Tidak (ada default) | **Bukan** secret | URL API backend aktivasi |
| `TELEGRAM_BOT_TOKEN` | Hanya jika fitur donasi dipakai | **Ya, secret** | Token bot Telegram penerima notifikasi donasi |
| `TELEGRAM_CHAT_ID` | Hanya jika fitur donasi dipakai | **Ya, secret** | Chat ID tujuan notifikasi donasi |

> ⚠️ Jangan pernah commit file `.env` yang sudah terisi. Set `TELEGRAM_BOT_TOKEN` &
> `TELEGRAM_CHAT_ID` langsung di dashboard hosting (mis. Environment Variables di Vercel), bukan
> di file yang ikut ter-commit ke repo.

## Development

```bash
npm run dev
```

Website berjalan di `http://localhost:8080`.

## Build & Deploy

```bash
npm run build
```

Tidak butuh database, tidak butuh server lokal khusus, dan tidak menulis file apa pun saat
runtime. Output build ada di folder `.output` / `dist`, tinggal deploy sesuai preset hosting yang
dipakai (Vercel, Cloudflare, dll). Semua panggilan ke API backend dilakukan dari sisi server
(server function), jadi tidak ada masalah CORS dan tidak ada credential yang bocor ke browser.

## Struktur Folder

```
public/
  favicon.png, favicon.ico
  robots.txt
  banner.jpg, avatar.jpg, qris.jpg
  images/
    logo.png, thumbnail.png, og-image.jpg
    panduan/               screenshot step-by-step (01–05)
src/
  components/
    site/                  Navbar, Footer, BottomNav, WelcomeModal, ActivationFlow,
                            ApiStatusCard, ApiStatusDot, DonationForm, Disclaimer,
                            AfterSuccess, NimzzAI
    ui/                    komponen dasar shadcn/ui (button, input, dialog, accordion, ...)
  config/
    api.ts                 URL & daftar endpoint API backend
    site.ts                nama situs, judul, deskripsi, OG image, keywords
  hooks/
    use-api-status.ts      cek health & info API + helper format
  lib/
    am-api.functions.ts       server function: health, info, send-link, verify
    donation.functions.ts     server function: kirim bukti transfer donasi ke Telegram
    unlimitedai.ts            client streaming ke provider AI untuk Nimzz AI
    error-capture.ts / error-page.ts / error-reporting.ts   penanganan error SSR
  routes/
    __root.tsx             layout global (navbar, footer, metadata, font)
    index.tsx              Home / landing
    aktivasi.tsx            Alur aktivasi 5 step
    panduan.tsx             Panduan lengkap step-by-step
    troubleshooting.tsx     Daftar masalah + solusi (accordion)
    faq.tsx                 FAQ
    status.tsx              API status + info paket
    sistem.tsx              Tentang sistem + diagram alur
    donasi.tsx               Halaman donasi (QRIS + upload bukti)
    api/nimzz-ai.ts          Endpoint chat streaming Nimzz AI
  styles.css               design system (warna, radius, animasi, font)
```

## Kustomisasi

| Ingin ganti... | Edit |
|---|---|
| Site URL | `src/config/site.ts` → `siteUrl` |
| Logo & favicon | `public/images/logo.png`, `public/favicon.png` |
| Thumbnail (hero & popup welcome) | `public/images/thumbnail.png` |
| OG image | `public/images/og-image.jpg` + `src/config/site.ts` → `ogImage` |
| URL API backend | `src/config/api.ts` → `API_BASE_URL`, atau env `VITE_API_BASE_URL` |
| QR donasi | `public/qris.jpg` |

## Catatan Keamanan

- Website tidak pernah menampilkan `idToken`, `refreshToken`, secret, atau credential internal
  apa pun — field sensitif difilter otomatis sebelum ditampilkan ke client (lihat
  `am-api.functions.ts`).
- Tidak ada secret yang disimpan di frontend/bundle client.
- Magic link hanya dikirim sekali ke API untuk diverifikasi, tidak disimpan.
- `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID` hanya boleh diset lewat environment variable hosting,
  jangan pernah di-hardcode atau ikut commit.
- Endpoint `/api/nimzz-ai` punya rate limit per-IP serta filter kata kasar & anti-jailbreak
  sederhana.

## Disclaimer

Layanan ini **tidak berafiliasi resmi** dengan Alight Creative / Alight Motion. Dibuat murni
sebagai proyek komunitas yang gratis dan tidak untuk diperjualbelikan.

## Lisensi

Belum ditentukan. Tambahkan file `LICENSE` (mis. MIT) di root project kalau ingin menetapkan
lisensi terbuka sebelum di-publish.

---

Dibuat dengan ❤️ oleh **Nimzz**.