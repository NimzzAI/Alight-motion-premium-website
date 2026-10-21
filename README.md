<div align="center">

![Alight Motion Premium Creator Banner](public/images/og-image.jpg)

# Alight Motion Premium Creator

**Platform utilitas web modern untuk aktivasi Alight Motion Premium (Pro) melalui verifikasi Magic Link secara instan.**  
Dirancang dan dikelola secara independen oleh **[Nimzz](https://github.com/Nimzz-pemboy)**.

[![Production URL](https://img.shields.io/badge/Live_Website-alight--motion--premium--nimzz.web.id-254EDB?style=for-the-badge&logo=googlechrome&logoColor=white)](https://alight-motion-premium-nimzz.web.id/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack_Start-SSR-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/start)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Production URL:** [https://alight-motion-premium-nimzz.web.id/](https://alight-motion-premium-nimzz.web.id/)  
*Gratis · Unofficial · Community Utility · Not for Commercial Resale*

</div>

---

## Daftar Isi

1. [Gambaran Umum & Arsitektur](#1-gambaran-umum--arsitektur)
2. [Fitur Unggulan](#2-fitur-unggulan)
3. [Peta Rute & Halaman](#3-peta-rute--halaman)
4. [Tech Stack & Spesifikasi Teknis](#4-tech-stack--spesifikasi-teknis)
5. [Struktur Direktori](#5-struktur-direktori)
6. [Panduan Instalasi & Pengembangan Lokal](#6-panduan-instalasi--pengembangan-lokal)
7. [Konfigurasi Environment Variables](#7-konfigurasi-environment-variables)
8. [Standar Keamanan & Privasi Data (PII Redaction)](#8-standar-keamanan--privasi-data-pii-redaction)
9. [SEO, OpenGraph & Structured Data (JSON-LD)](#9-seo-opengraph--structured-data-json-ld)
10. [Build & Deployment Produksi](#10-build--deployment-produksi)
11. [Disclaimer & Lisensi](#11-disclaimer--lisensi)

---

## 1. Gambaran Umum & Arsitektur

**Alight Motion Premium Creator** adalah aplikasi web berbasis **Server-Side Rendering (SSR)** yang dibangun menggunakan **React 19** dan **TanStack Start (Vite + Nitro)**. Aplikasi ini bertindak sebagai antarmuka pengguna (*frontend gateway*) yang menjembatani pengguna akhir dengan layanan backend API aktivasi (`https://am-premium-nimzz.vercel.app`) melalui *Server Functions* terisolasi.

```
┌──────────────────────┐       RPC / ServerFn        ┌──────────────────────────┐       HTTPS / JSON        ┌──────────────────────────┐
│   Browser Client     │ ──────────────────────────► │   TanStack Start SSR     │ ────────────────────────► │   AM Activation API      │
│  (React 19 + Canvas) │ ◄────────────────────────── │  (PII Filter & Redactor) │ ◄──────────────────────── │  (Gateway & Verification)│
└──────────────────────┘    Sanitized Payload Only   └──────────────────────────┘                           └──────────────────────────┘
```

Seluruh komunikasi ke API eksternal dan Telegram Bot dieksekusi di sisi server (*server-side*), sehingga bebas dari kendala CORS di peramban serta menjamin tidak ada token, kredensial, maupun kunci API yang terekspos ke *client bundle*.

---

## 2. Fitur Unggulan

- **5-Step Guided Activation Pipeline (`/aktivasi`)**  
  Alur aktivasi terstruktur mulai dari validasi alamat email, pengiriman *Magic Link*, panduan pengecekan folder Spam Gmail, ekstraksi URL autentikasi, hingga verifikasi lisensi Pro dengan *state persistence* (`localStorage`) dan *countdown timer* masa aktif tautan 5 menit.
- **Real-Time HTML5 Canvas Testimonials (`/testimoni`)**  
  Papan kanvas interaktif (*spatial drag & zoom board* serta *gallery grid*) yang merender kartu bukti aktivasi secara langsung menggunakan elemen `<canvas>` HTML5 beresolusi tinggi (mendukung 3 tema visual: *Obsidian Dark*, *Studio Light*, *Cobalt Blueprint*), dilengkapi mode sensor blok penuh dan fitur unduh kartu bukti `.png`.
- **Automatic PII Redaction & Security Sanitization**  
  Setiap data pengguna yang ditampilkan pada halaman publik maupun kanvas testimoni disensor secara otomatis di tingkat server (`us•••••••@gmail.com`, `GPA.3389-••••-••••-7741`, `mP9x••••••••••8cA1`). Field sensitif seperti `idToken` dan `refreshToken` diblokir oleh filter ekspresi reguler sebelum dikirim ke klien.
- **Architectural Studio UI & 60fps Hardware-Accelerated Motion**  
  Menggunakan sistem desain *High-Craft Light Mode* (Warm Alabaster & Carbon Ink) dengan tipografi *Bricolage Grotesque*, *Plus Jakarta Sans*, dan *JetBrains Mono*, serta transisi kompositor GPU (`transform`, `opacity`, `IntersectionObserver`, `requestAnimationFrame`).
- **Nimzz AI Streaming Assistant (`/api/nimzz-ai`)**  
  Asisten panduan kontekstual berbasis *Server-Sent Events (SSE)* yang memandu pengguna baru saat mengalami kendala (terutama langkah mencari email di folder Spam dan menyalin tautan masuk), dilengkapi *rate limiter* berbasis IP serta filter keamanan *anti-jailbreak*.
- **Real-Time API Telemetry & Health Check (`/status`)**  
  Pemantauan langsung ketersediaan *gateway* API, versi layanan, *uptime* server, dan spesifikasi paket berlangganan aktif.

---

## 3. Peta Rute & Halaman

| Rute | Komponen File | Fungsi & Deskripsi |
| :--- | :--- | :--- |
| `/` | `src/routes/index.tsx` | Halaman utama (*Hero*, alur 5 tahap aktivasi, daftar prasyarat, dan ringkasan FAQ). |
| `/aktivasi` | `src/routes/aktivasi.tsx` | Ruang kerja aktivasi 5 langkah interaktif dengan *progress tracker* dan panel hasil aktivasi. |
| `/testimoni` | `src/routes/testimoni.tsx` | Papan kanvas interaktif bukti aktivasi *real-time* dengan sensor privasi otomatis & studio unduh PNG. |
| `/panduan` | `src/routes/panduan.tsx` | Dokumentasi visual langkah demi langkah beserta tangkapan layar (*screenshots*) aplikasi Gmail. |
| `/troubleshooting` | `src/routes/troubleshooting.tsx` | Direktori kode error (`INVALID_EMAIL`, `INVALID_OOB_CODE`, `EXPIRED_OOB_CODE`, `TOO_MANY_ATTEMPTS`) beserta solusinya. |
| `/faq` | `src/routes/faq.tsx` | Daftar pertanyaan umum seputar keamanan, sifat layanan gratis, dan masa berlaku *Magic Link*. |
| `/status` | `src/routes/status.tsx` | Panel telemetri kesehatan server API (*health check*), *uptime*, dan rincian paket Pro. |
| `/sistem` | `src/routes/sistem.tsx` | Dokumentasi transparansi cara kerja arsitektur sistem dan prinsip privasi pengguna. |
| `/donasi` | `src/routes/donasi.tsx` | Dukungan sukarela pemeliharaan server via QRIS dengan fitur unggah bukti transfer ke Telegram. |
| `/kontribusi` | `src/routes/kontribusi.tsx` | Profil pengembang (**Nimzz**), catatan rilis, dan kanal komunitas resmi. |
| `/api/nimzz-ai` | `src/routes/api/nimzz-ai.ts` | Endpoint API POST *streaming* untuk asisten percakapan Nimzz AI. |

---

## 4. Tech Stack & Spesifikasi Teknis

| Kategori | Teknologi | Versi | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Core Framework** | React + TypeScript | `19.2.0` / `5.8.3` | Library UI deklaratif dengan *strict type safety*. |
| **SSR & Routing** | TanStack Start + Router | `^1.169.3` / `^1.170.45` | Full-stack SSR, *file-based routing*, dan *type-safe Server Functions*. |
| **Build & Server** | Vite + Nitro | `8.1.5` / `3.0.x` | Bundler generasi terbaru dan *universal server runtime*. |
| **Styling & UI** | Tailwind CSS v4 + Radix UI | `^4.2.1` | Desain utilitas CSS modern dan komponen aksesibel (`shadcn/ui`). |
| **State & Fetching** | TanStack React Query | `^5.101.1` | Manajemen *cache* asinkron, *polling* telemetri API, dan mutasi data. |
| **Validation** | Zod + React Hook Form | `^3.25.76` | Validasi skema payload di sisi klien maupun server RPC. |
| **Typography & Icons** | Google Fonts + Font Awesome | `6.5.2` | *Bricolage Grotesque*, *Plus Jakarta Sans*, *JetBrains Mono*, dan ikonografi vektor. |

---

## 5. Struktur Direktori

```text
alight-motion-premium-website/
├── public/
│   ├── images/
│   │   ├── panduan/              # Ilustrasi langkah demi langkah (01-buka-gmail s/d 05-salin-url)
│   │   ├── logo.png              # Logo identitas aplikasi
│   │   ├── og-image.jpg          # OpenGraph social preview banner (1200x640)
│   │   └── thumbnail.png         # Pratinjau aplikasi
│   ├── avatar.jpg                # Avatar profil pengembang
│   ├── banner.jpg                # Banner halaman kontribusi
│   ├── favicon.ico               # Favicon standar browser
│   ├── favicon.png               # App icon beresolusi tinggi
│   ├── qris.jpg                  # Kode QRIS untuk dukungan komunitas
│   ├── robots.txt                # Konfigurasi perayap mesin pencari
│   ├── site.webmanifest          # Web App Manifest
│   └── sitemap.xml               # Peta situs XML untuk pengindeksan SEO
├── src/
│   ├── components/
│   │   ├── site/                 # Komponen arsitektural utama aplikasi
│   │   │   ├── ActivationFlow.tsx    # Mesin alur kerja aktivasi 5 langkah
│   │   │   ├── AfterSuccess.tsx      # Panduan pasca-aktivasi
│   │   │   ├── ApiStatusCard.tsx     # Kartu telemetri status gateway API
│   │   │   ├── ApiStatusDot.tsx      # Indikator status real-time inline
│   │   │   ├── BottomNav.tsx         # Navigasi bawah khusus perangkat mobile
│   │   │   ├── Disclaimer.tsx        # Klausul transparansi & ketidakterkaitan resmi
│   │   │   ├── DonationForm.tsx      # Formulir unggah bukti transfer QRIS
│   │   │   ├── Footer.tsx            # Footer arsitektural
│   │   │   ├── MotionPrimitives.tsx  # Primitif animasi 60fps (Reveal, SpotlightSurface, SignalPipeline)
│   │   │   ├── Navbar.tsx            # Navigasi atas 3-zona
│   │   │   ├── NimzzAI.tsx           # Widget asisten chat streaming
│   │   │   ├── TestimonialCanvas.tsx # Engine HTML5 <canvas> renderer & PNG exporter
│   │   │   └── WelcomeModal.tsx      # Dialog sambutan kontekstual
│   │   └── ui/                   # Komponen primitif berbasis Radix UI / shadcn
│   ├── config/
│   │   ├── api.ts                # Konfigurasi base URL & endpoint backend aktivasi
│   │   └── site.ts               # Konfigurasi terpusat domain, metadata SEO, & helper OpenGraph
│   ├── hooks/
│   │   └── use-api-status.ts     # Custom hooks pemantauan kesehatan API & formatter waktu
│   ├── lib/
│   │   ├── am-api.functions.ts       # Server Functions: getHealth, getInfo, sendMagicLink, verifyMagicLink
│   │   ├── donation.functions.ts     # Server Function: pengiriman bukti donasi ke Telegram Bot API
│   │   ├── testimonials.functions.ts # Server Functions & PII Redactor untuk kanvas testimoni
│   │   ├── unlimitedai.ts            # Klien streaming LLM untuk asisten Nimzz AI
│   │   ├── error-capture.ts          # Pelacak error SSR
│   │   ├── error-page.ts             # Fallback halaman error HTML statis
│   │   ├── error-reporting.ts        # Pelapor telemetri error sisi klien
│   │   └── utils.ts                  # Utilitas penggabungan kelas Tailwind (cn)
│   ├── routes/                   # Definisi rute berbasis file (TanStack Router)
│   ├── router.tsx                # Inisialisasi instance TanStack Router
│   ├── server.ts                 # Entrypoint server SSR & normalisasi respons error
│   ├── start.ts                  # Middleware global TanStack Start (CSRF & Error Handling)
│   └── styles.css                # Konfigurasi tema Tailwind CSS v4, variabel warna, & keyframe 60fps
├── .env.example                  # Template variabel lingkungan
├── components.json               # Konfigurasi shadcn/ui
├── eslint.config.js              # Aturan pemeriksaan kualitas kode (ESLint 9 Flat Config)
├── package.json                  # Daftar dependensi dan skrip otomatisasi
├── tsconfig.json                 # Konfigurasi kompilator TypeScript
└── vite.config.ts                # Konfigurasi bundler Vite, TanStack Start, & Nitro
```

---

## 6. Panduan Instalasi & Pengembangan Lokal

### Prasyarat Sistem
- **Node.js** versi `>= 20.12.0` (direkomendasikan Node.js 22 LTS)
- **npm** (v10+)

### Langkah Instalasi

1. **Kloning repositori:**
   ```bash
   git clone https://github.com/NimzzAI/Alight-motion-premium-website.git
   cd Alight-motion-premium-website
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Siapkan variabel lingkungan:**
   ```bash
   cp .env.example .env
   ```

4. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara default di `http://localhost:3000`.

### Daftar Skrip (`package.json`)

| Perintah | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan Vite + TanStack Start pada port `3000`. |
| `npm run build` | Membangun bundel produksi (*client* & *SSR server*) menggunakan Vite dan Nitro. |
| `npm run preview` | Menjalankan pratinjau hasil *build* produksi secara lokal. |
| `npm run lint` | Memvalidasi standar kode TypeScript dan React menggunakan ESLint. |
| `npm run format` | Merapikan format seluruh kode sumber menggunakan Prettier. |

---

## 7. Konfigurasi Environment Variables

Buat file `.env` di direktori akar (*root*) atau atur langsung pada panel *Environment Variables* penyedia *hosting* Anda:

```dotenv
# URL API Backend Aktivasi (Opsional — memiliki fallback default ke server utama)
VITE_API_BASE_URL=https://am-premium-nimzz.vercel.app

# Konfigurasi Bot Telegram untuk Fitur Unggah Bukti Donasi (Rahasia / Server-Only)
TELEGRAM_BOT_TOKEN=1234567890:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TELEGRAM_CHAT_ID=123456789
```

| Nama Variabel | Sifat | Wajib? | Keterangan |
| :--- | :--- | :---: | :--- |
| `VITE_API_BASE_URL` | Publik | Tidak | Mengarahkan *Server Functions* ke endpoint gateway API aktivasi kustom. |
| `TELEGRAM_BOT_TOKEN` | **Rahasia (Server)** | Opsional | Token otorisasi HTTP API dari `@BotFather` untuk menerima unggahan foto bukti QRIS. |
| `TELEGRAM_CHAT_ID` | **Rahasia (Server)** | Opsional | ID pengguna/grup/channel Telegram tujuan pengiriman notifikasi donasi. |

---

## 8. Standar Keamanan & Privasi Data (PII Redaction)

Aplikasi ini menerapkan perlindungan berlapis untuk menjaga keamanan sesi dan privasi pengguna:

1. **Sanitasi Kredensial Respons API (`src/lib/am-api.functions.ts`)**  
   Setiap properti JSON yang mengandung kata kunci sensitif (`/token|secret|credential|password|cookie|refresh|idtoken|apikey/i`) dibuang secara otomatis di sisi server sebelum dikembalikan ke klien.
2. **Sensor Identitas Otomatis (`src/lib/testimonials.functions.ts`)**  
   Saat aktivasi berhasil dan dicatat ke aliran testimoni kanvas:
   - **Email** disamarkan menjadi format `ri••••••99@gmail.com`.
   - **Order ID (GPA)** disamarkan menjadi format `GPA.3389-••••-••••-7741`.
   - **User ID (UID)** disamarkan menjadi format `mP9x••••••••••8cA1`.
3. **Perlindungan CSRF & Validasi Skema Ketat**  
   Seluruh *Server Functions* dilindungi oleh `createCsrfMiddleware` di `src/start.ts` serta divalidasi menggunakan skema **Zod** (`emailSchema`, `verifySchema`, dan validasi ukuran/MIME berkas gambar pada `sendDonationProof`).
4. **Rate Limiting & Content Guardrails (`src/routes/api/nimzz-ai.ts`)**  
   Endpoint asisten AI membatasi frekuensi permintaan per alamat IP (*in-memory token bucket*) serta menyaring upaya manipulasi instruksi sistem (*prompt injection / jailbreak*).

---

## 9. SEO, OpenGraph & Structured Data (JSON-LD)

Seluruh konfigurasi metadata terpusat di `src/config/site.ts` dengan domain kanonikal resmi **`https://alight-motion-premium-nimzz.web.id`**:

- **Canonical & Robots Directives**: Setiap halaman memiliki tag `<link rel="canonical">` spesifik dan arahan `index, follow, max-image-preview:large`.
- **OpenGraph & Twitter Cards**: Mendukung pratinjau kartu visual ukuran penuh (`summary_large_image`, `1200x640`) saat tautan dibagikan di WhatsApp, Telegram, Discord, maupun X/Twitter.
- **Schema.org Rich Snippets (JSON-LD)**:
  - `WebSite`, `Organization`, dan `WebApplication` pada layout akar (`src/routes/__root.tsx`).
  - `HowTo` pada halaman Panduan Lengkap (`src/routes/panduan.tsx`).
  - `FAQPage` pada halaman Pertanyaan Umum (`src/routes/faq.tsx`).
- **Sitemap & Manifest**: Dilengkapi `public/sitemap.xml`, `public/robots.txt`, dan `public/site.webmanifest`.

---

## 10. Build & Deployment Produksi

Proyek ini menggunakan **Nitro** sebagai *adapter* server universal sehingga siap di-deploy ke berbagai platform modern (Vercel, Cloudflare Pages/Workers, Netlify, maupun VPS berbasis Node.js/Docker):

```bash
# 1. Jalankan pemeriksaan kualitas kode
npm run lint

# 2. Bangun bundel produksi
npm run build
```

Untuk menyesuaikan domain utama apabila menggunakan *custom domain* berbeda di masa mendatang, cukup perbarui properti `siteUrl` pada `src/config/site.ts`:

```ts
export const siteConfig = {
  siteUrl: "https://alight-motion-premium-nimzz.web.id",
  // ...
};
```

---

## 11. Disclaimer & Lisensi

- **Independen & Unofficial**: Proyek ini adalah inisiatif komunitas independen yang dikembangkan oleh **Nimzz** dan tidak berafiliasi dengan, disponsori oleh, ataupun disetujui oleh **Alight Creative, Inc.**
- **Gratis untuk Komunitas**: Layanan ini disediakan secara cuma-cuma (*free of charge*) untuk tujuan edukasi dan utilitas komunitas. Dilarang memperjualbelikan akses ke situs ini.

---

<div align="center">

Dikembangkan dan dikelola oleh **[Nimzz](https://github.com/Nimzz-pemboy)** · [Website Resmi](https://alight-motion-premium-nimzz.web.id/) · [Telegram](https://t.me/Nimzz4)

</div>
