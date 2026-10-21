import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BottomNav } from "@/components/site/BottomNav";
import { NimzzAI } from "@/components/site/NimzzAI";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig, absoluteUrl } from "@/config/site";

function NotFoundComponent() {
  return (
    <div className="bg-studio-grid flex min-h-[75vh] items-center justify-center px-4">
      <div className="animate-fade-up max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface text-primary">
          <i className="fa-solid fa-compass text-lg" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-foreground">404</h1>
        <h2 className="mt-1 text-lg font-semibold text-foreground">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="motion-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="bg-studio-grid flex min-h-[75vh] items-center justify-center px-4">
      <div className="animate-fade-up max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
          <i className="fa-solid fa-triangle-exclamation text-lg" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Halaman gagal dimuat
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Terjadi kendala saat menyiapkan halaman ini. Coba muat ulang atau kembali ke beranda.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="motion-press inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <i className="fa-solid fa-rotate-right text-xs" aria-hidden="true" />
            Coba Lagi
          </button>
          <a
            href="/"
            className="motion-press inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
          >
            <i className="fa-solid fa-house text-xs" aria-hidden="true" />
            Beranda
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.title },
      { name: "description", content: siteConfig.description },
      { name: "keywords", content: siteConfig.keywords },
      { name: "author", content: siteConfig.author },
      { name: "theme-color", content: "#f8f7f4" },
      { property: "og:site_name", content: siteConfig.siteName },
      { property: "og:type", content: "website" },
      { property: "og:title", content: siteConfig.title },
      { property: "og:description", content: siteConfig.description },
      { property: "og:url", content: absoluteUrl("/") },
      { property: "og:image", content: absoluteUrl(siteConfig.ogImage) },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "640" },
      { property: "og:locale", content: "id_ID" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: siteConfig.title },
      { name: "twitter:description", content: siteConfig.description },
      { name: "twitter:image", content: absoluteUrl(siteConfig.ogImage) },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: absoluteUrl("/") },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: siteConfig.logo },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.siteName,
          url: siteConfig.siteUrl,
          description: siteConfig.description,
          inLanguage: "id-ID",
          publisher: {
            "@type": "Organization",
            name: siteConfig.author,
            url: absoluteUrl("/"),
            logo: absoluteUrl(siteConfig.logo),
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.siteName,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Web",
          url: siteConfig.siteUrl,
          image: absoluteUrl(siteConfig.ogImage),
          description: siteConfig.description,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "IDR",
          },
          author: {
            "@type": "Organization",
            name: siteConfig.author,
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-studio-grid flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div key={pathname} className="animate-page-enter">
            <Outlet />
          </div>
        </main>
        <Footer />
        <BottomNav />
      </div>
      <NimzzAI />
      <Toaster />
    </QueryClientProvider>
  );
}
