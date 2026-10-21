export const siteConfig = {
  siteUrl: "https://alight-motion-premium-nimzz.web.id",
  siteName: "Alight Motion Premium Creator",
  shortName: "AM Premium Creator",
  title: "Alight Motion Premium Creator — Aktivasi Pro Gratis oleh Nimzz",
  description:
    "Platform utilitas komunitas gratis & unofficial oleh Nimzz untuk aktivasi Alight Motion Premium (Pro) melalui verifikasi Magic Link instan lengkap dengan panduan visual.",
  keywords:
    "alight motion premium, alight motion pro gratis, alight motion creator, aktivasi alight motion, magic link alight motion, am pro nimzz, alight motion premium nimzz, tutorial alight motion premium",
  author: "Nimzz",
  authorUrl: "https://github.com/Nimzz-pemboy",
  telegramHandle: "@Nimzz4",
  locale: "id_ID",
  language: "id",
  themeColor: "#f9f8f5",
  ogImage: "/images/og-image.jpg",
  logo: "/images/logo.png",
  thumbnail: "/images/thumbnail.png",
};

export function absoluteUrl(path = "/") {
  const cleanBase = siteConfig.siteUrl.replace(/\/+$/, "");
  if (!path || path === "/") return `${cleanBase}/`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogType?: "website" | "article";
}

export function buildPageSeo({
  title,
  description,
  path,
  keywords = siteConfig.keywords,
  ogType = "website",
}: PageSeoInput) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(siteConfig.ogImage);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: siteConfig.author },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: siteConfig.siteName },
      { property: "og:type", content: ogType },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:secure_url", content: imageUrl },
      { property: "og:image:alt", content: title },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "640" },
      { property: "og:locale", content: siteConfig.locale },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: title },
      { name: "twitter:creator", content: siteConfig.telegramHandle },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
