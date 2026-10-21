import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs";
import { z } from "zod";

export type TestimonialRecord = {
  id: string;
  maskedEmail: string;
  maskedUid: string;
  maskedOrderId: string;
  plan: string;
  licenseType: string;
  productId: string;
  duration: string;
  validUntil: string;
  activatedAt: string;
  source: "live" | "verified";
};

const CACHE_FILE = "/tmp/am_testimonials_feed.json";
const MAX_RECORDS = 40;

export function maskEmail(raw?: string): string {
  if (!raw || !raw.includes("@")) return "us•••••••@gmail.com";
  const [localPart = "user", domainPart = "gmail.com"] = raw.trim().toLowerCase().split("@");
  if (localPart.length <= 2) {
    return `${localPart[0] ?? "u"}••••••@${domainPart}`;
  }
  const head = localPart.slice(0, 2);
  const tail = localPart.length > 4 ? localPart.slice(-2) : localPart.slice(-1);
  return `${head}••••••${tail}@${domainPart}`;
}

export function maskOrderId(raw?: string): string {
  if (!raw || raw.trim().length < 6) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `GPA.3392-••••-••••-${rand}`;
  }
  const clean = raw.trim();
  if (clean.startsWith("GPA.") && clean.length >= 16) {
    return `${clean.slice(0, 8)}-••••-••••-${clean.slice(-4)}`;
  }
  return `${clean.slice(0, 4)}••••••••${clean.slice(-4)}`;
}

export function maskUid(raw?: string): string {
  if (!raw || raw.trim().length < 6) {
    return "xK9m••••••••••8cF3";
  }
  const clean = raw.trim();
  return `${clean.slice(0, 4)}••••••••••${clean.slice(-4)}`;
}

function formatValidUntil(offsetDays = 365): string {
  const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

function createInitialSeed(): TestimonialRecord[] {
  const now = Date.now();
  const seeds = [
    {
      email: "rizky.pratama99@gmail.com",
      uid: "mP9xK2vL8qR4nW1zT5yB8cA1",
      orderId: "GPA.3389-4821-9012-77412",
      minsAgo: 2,
    },
    {
      email: "nabila.putri04@gmail.com",
      uid: "kL3nQ8wR1tY6uI9oP2aS5dF7",
      orderId: "GPA.3389-7104-3329-19044",
      minsAgo: 7,
    },
    {
      email: "dimas.aditya21@gmail.com",
      uid: "vB7nM2qW4eR6tY8uI0oP3lK9",
      orderId: "GPA.3389-5591-8240-63108",
      minsAgo: 14,
    },
    {
      email: "fajar.nugroho88@gmail.com",
      uid: "zX4cV6bN8mQ1wE3rT5yU7iO2",
      orderId: "GPA.3389-1190-6472-90315",
      minsAgo: 23,
    },
    {
      email: "alya.safitri17@gmail.com",
      uid: "hJ5kL7pO9iU2yT4rE6wQ8aS3",
      orderId: "GPA.3389-8432-2910-44821",
      minsAgo: 35,
    },
    {
      email: "bagas.saputra09@gmail.com",
      uid: "qW2eR4tY6uI8oP0aS3dF5gH7",
      orderId: "GPA.3389-3092-7651-51209",
      minsAgo: 49,
    },
    {
      email: "citra.lestari12@gmail.com",
      uid: "pL9oK8iJ7uH6yG5tF4rD3sA2",
      orderId: "GPA.3389-6721-1094-88340",
      minsAgo: 64,
    },
    {
      email: "farhan.akbar05@gmail.com",
      uid: "mN1bV3cX5zL7kJ9hG2fD4sA6",
      orderId: "GPA.3389-9284-5410-32917",
      minsAgo: 82,
    },
  ];

  return seeds.map((s, idx) => {
    const ts = new Date(now - s.minsAgo * 60 * 1000);
    return {
      id: `AM-VER-${(89420 - idx * 3).toString(16).toUpperCase()}`,
      maskedEmail: maskEmail(s.email),
      maskedUid: maskUid(s.uid),
      maskedOrderId: maskOrderId(s.orderId),
      plan: "Alight Motion Pro / Member",
      licenseType: "Yearly VIP License",
      productId: "am.full.sub.annual.19q4",
      duration: "1 Tahun",
      validUntil: formatValidUntil(365),
      activatedAt: ts.toISOString(),
      source: "verified",
    };
  });
}

let memoryStore: TestimonialRecord[] | null = null;

function readStore(): TestimonialRecord[] {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryStore = parsed as TestimonialRecord[];
        return memoryStore;
      }
    }
  } catch {
    // ignore fs read errors
  }
  memoryStore = createInitialSeed();
  writeStore(memoryStore);
  return memoryStore;
}

function writeStore(records: TestimonialRecord[]) {
  memoryStore = records.slice(0, MAX_RECORDS);
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(memoryStore), "utf-8");
  } catch {
    // ignore fs write errors
  }
}

export function recordActivationTestimonial(input: {
  email?: string | undefined;
  uid?: string | undefined;
  orderId?: string | undefined;
  plan?: string | undefined;
  duration?: string | undefined;
  validUntil?: string | undefined;
}): TestimonialRecord {
  const current = readStore();
  const randomHex = Math.floor(10000 + Math.random() * 90000)
    .toString(16)
    .toUpperCase();

  const record: TestimonialRecord = {
    id: `AM-LIVE-${randomHex}`,
    maskedEmail: maskEmail(input.email),
    maskedUid: maskUid(input.uid),
    maskedOrderId: maskOrderId(input.orderId),
    plan: input.plan ?? "Alight Motion Pro / Member",
    licenseType: "Yearly VIP License",
    productId: "am.full.sub.annual.19q4",
    duration: input.duration ?? "1 Tahun",
    validUntil: input.validUntil ?? formatValidUntil(365),
    activatedAt: new Date().toISOString(),
    source: "live",
  };

  writeStore([record, ...current]);
  return record;
}

export const getTestimonials = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    records: TestimonialRecord[];
    serverTime: string;
    totalCount: number;
  }> => {
    const records = readStore();
    return {
      records,
      serverTime: new Date().toISOString(),
      totalCount: 1240 + records.length,
    };
  },
);

const simulateSchema = z.object({
  emailHint: z.string().trim().max(120).optional(),
});

export const simulateLiveTestimonial = createServerFn({ method: "POST" })
  .validator((data: unknown) => simulateSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<TestimonialRecord> => {
    const samplePrefixes = [
      "angga.putra",
      "nadia.kusuma",
      "kevin.pratama",
      "salsa.azzahra",
      "reza.maulana",
      "tiara.dewi",
      "bayu.setiawan",
      "putri.amelia",
    ];
    const picked =
      data.emailHint && data.emailHint.includes("@")
        ? data.emailHint
        : `${samplePrefixes[Math.floor(Math.random() * samplePrefixes.length)]}${Math.floor(10 + Math.random() * 89)}@gmail.com`;

    const randOrder = `GPA.3394-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 89999)}`;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let randUid = "";
    for (let i = 0; i < 24; i++) {
      randUid += chars[Math.floor(Math.random() * chars.length)];
    }

    return recordActivationTestimonial({
      email: picked,
      uid: randUid,
      orderId: randOrder,
      plan: "Alight Motion Pro / Member",
      duration: "1 Tahun",
      validUntil: formatValidUntil(365),
    });
  });
