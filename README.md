# Alight Motion Premium Creator — by Nimzz

Frontend untuk API aktivasi yang sudah tersedia di
`https://am-premium-nimzz.vercel.app`. Website ini hanya mengintegrasikan endpoint
resmi API tersebut: mengirim magic link ke email, lalu memverifikasinya.

Gratis • Unofficial • Not for Resale

## 1. Cara install

```bash
npm install
```

## 2. Menjalankan development

```bash
npm run dev
```

Website berjalan di `http://localhost:8080`.

## 3. Build production

```bash
npm run build
```

## 4. Deploy

Project ini adalah aplikasi React + TanStack Start (Vite). Tidak butuh database,
tidak butuh server lokal khusus, dan tidak menulis file apa pun saat runtime.

Jalankan `npm run build`, lalu deploy sesuai preset hosting yang kamu pakai
(output ada di folder `.output` / `dist` hasil build Vite).

Panggilan ke API dilakukan dari sisi server aplikasi (server function) supaya
tidak ada masalah CORS dan tidak ada credential yang bocor ke browser.

## 5. Mengganti site URL

Edit `src/config/site.ts` → `siteUrl`.

## 6. Mengganti logo

Ganti file `public/images/logo.png` (format PNG, sebaiknya persegi).
Untuk favicon, ganti juga `public/favicon.png`.

## 7. Mengganti thumbnail

Ganti file `public/images/thumbnail.png`. Gambar ini dipakai pada hero dan popup
welcome.

## 8. Mengganti OG image

Ganti file `public/images/og-image.png` (ukuran ideal 1200x630, di bawah ~1 MB).
Path-nya diatur di `src/config/site.ts` → `ogImage`.

## 9. Mengubah API URL

Edit `src/config/api.ts` → `API_BASE_URL`, atau set environment variable
`VITE_API_BASE_URL` (lihat `.env.example`). URL API bukan secret.
Jangan pernah menyimpan token, secret, atau credential di frontend.

## 10. Struktur folder

```
public/
  favicon.png
  robots.txt
  images/            logo.png, thumbnail.png, og-image.png
src/
  components/
    site/            Navbar, Footer, WelcomeModal, ActivationFlow, ApiStatus*, dll
    ui/              komponen dasar (button, input, dialog, accordion, ...)
  config/
    api.ts           URL & daftar endpoint API (satu sumber)
    site.ts          nama situs, judul, deskripsi, OG image
  hooks/
    use-api-status.ts  cek health & info API + helper format
  lib/
    am-api.functions.ts  server function: health, info, send-link, verify
  routes/
    __root.tsx       layout global (navbar, footer, metadata, font, Font Awesome)
    index.tsx        Home / landing
    aktivasi.tsx     Alur aktivasi 5 step
    panduan.tsx      Panduan lengkap step-by-step
    troubleshooting.tsx  Daftar masalah + solusi (accordion)
    faq.tsx          FAQ
    status.tsx       API status + info paket
    sistem.tsx       Tentang sistem + diagram alur
  styles.css         design system (warna, radius, animasi, font)
```

## Catatan keamanan

- Website tidak menampilkan `idToken`, `refreshToken`, secret, atau credential
  internal apa pun.
- Tidak ada secret yang disimpan di frontend.
- Magic link hanya dikirim sekali ke API untuk diverifikasi, tidak disimpan.

Created by Nimzz.
