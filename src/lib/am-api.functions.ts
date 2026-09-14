import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export type HealthResult = {
  online: boolean;
  version?: string | undefined;
  uptime?: number | undefined;
  ts?: string | undefined;
  checkedAt: string;
};

export type PlanInfo = {
  name?: string | undefined;
  type?: string | undefined;
  duration?: string | undefined;
};

export type InfoResult = {
  ok: boolean;
  plan?: PlanInfo | undefined;
  benefits?: string[] | undefined;
};

export type ActionResult = {
  ok: boolean;
  message: string;
  code?: string | undefined;
  data?: {
    email?: string | undefined;
    uid?: string | undefined;
    orderId?: string | undefined;
    plan?: string | undefined;
    duration?: string | undefined;
    validUntil?: string | undefined;
    benefits?: string[] | undefined;
  } | undefined;
};

const SENSITIVE = /token|secret|credential|password|cookie|refresh|idtoken|apikey/i;

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "" && !SENSITIVE.test(key)) {
      return value;
    }
  }
  return undefined;
}

function readableError(payload: Record<string, unknown>, status: number): ActionResult {
  const rawCode =
    pickString(payload, ["code", "error", "errorCode", "reason"]) ??
    (status >= 500 ? "SERVER_ERROR" : "UNKNOWN_ERROR");
  const code = rawCode.toUpperCase().replace(/[^A-Z_]/g, "_");
  const message =
    pickString(payload, ["message", "msg", "detail", "description"]) ??
    errorMessageFor(code);
  const generic = code === "UNKNOWN_ERROR" || code === "SERVER_ERROR";
  return {
    ok: false,
    ...(generic ? {} : { code }),
    message: SENSITIVE.test(message) ? errorMessageFor(code) : message,
  };
}

export function errorMessageFor(code?: string): string {
  switch (code) {
    case "INVALID_EMAIL":
      return "Format email tidak valid. Contoh yang benar: nama@gmail.com";
    case "INVALID_OOB_CODE":
      return "Link tidak valid atau sudah tidak dapat digunakan. Minta link baru melalui proses pengiriman email.";
    case "EXPIRED_OOB_CODE":
      return "Link sudah kedaluwarsa. Kirim link baru dan gunakan sebelum masa berlakunya habis.";
    case "TOO_MANY_ATTEMPTS":
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Terlalu banyak percobaan. Tunggu beberapa saat sebelum mencoba lagi.";
    case "API_OFFLINE":
      return "API sedang tidak dapat dihubungi. Periksa koneksi internet lalu tekan Refresh Status.";
    case "ACTIVATION_FAILED":
      return "Link berhasil diproses, tetapi layanan aktivasi belum berhasil menyelesaikan proses. Coba kembali nanti atau hubungi pengelola layanan.";
    default:
      return "Terjadi kesalahan. Silakan coba beberapa saat lagi.";
  }
}

async function callApi(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; payload: Record<string, unknown> } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        origin: API_BASE_URL,
        referer: `${API_BASE_URL}/`,
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(30000),
    });
    let payload: Record<string, unknown> = {};
    try {
      const parsed = await response.json();
      if (parsed && typeof parsed === "object") payload = parsed as Record<string, unknown>;
    } catch {
      payload = {};
    }
    return { status: response.status, payload };
  } catch {
    return null;
  }
}

export const getHealth = createServerFn({ method: "GET" }).handler(
  async (): Promise<HealthResult> => {
    const checkedAt = new Date().toISOString();
    const result = await callApi(API_ENDPOINTS.health);
    if (!result || result.status >= 400) return { online: false, checkedAt };
    const payload = result.payload;
    return {
      online: payload["status"] === "online" || payload["status"] === true,
      version: typeof payload["version"] === "string" ? payload["version"] : undefined,
      uptime: typeof payload["uptime"] === "number" ? payload["uptime"] : undefined,
      ts: typeof payload["ts"] === "string" ? payload["ts"] : undefined,
      checkedAt,
    };
  },
);

export const getInfo = createServerFn({ method: "GET" }).handler(async (): Promise<InfoResult> => {
  const result = await callApi(API_ENDPOINTS.info);
  if (!result || result.status >= 400) return { ok: false };
  const payload = result.payload;
  const plan = (payload["plan"] ?? {}) as Record<string, unknown>;
  const benefits = Array.isArray(payload["benefits"])
    ? (payload["benefits"] as unknown[]).filter((b): b is string => typeof b === "string")
    : undefined;
  return {
    ok: true,
    plan: {
      name: typeof plan["name"] === "string" ? plan["name"] : undefined,
      type: typeof plan["type"] === "string" ? plan["type"] : undefined,
      duration: typeof plan["duration"] === "string" ? plan["duration"] : undefined,
    },
    benefits,
  };
});

const emailSchema = z.object({ email: z.string().trim().min(3).max(320) });

export const sendMagicLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }): Promise<ActionResult> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      return { ok: false, code: "INVALID_EMAIL", message: errorMessageFor("INVALID_EMAIL") };
    }
    const result = await callApi(API_ENDPOINTS.sendLink, {
      method: "POST",
      body: JSON.stringify({ email: data.email }),
    });
    if (!result) {
      return { ok: false, code: "API_OFFLINE", message: errorMessageFor("API_OFFLINE") };
    }
    if (result.status >= 400 || result.payload["status"] === false) {
      return readableError(result.payload, result.status);
    }
    return {
      ok: true,
      message: "Link berhasil dikirim. Sekarang buka inbox email kamu.",
      data: { email: data.email },
    };
  });

const verifySchema = z.object({
  email: z.string().trim().min(3).max(320),
  magicLink: z.string().trim().min(10).max(4000),
});

export const verifyMagicLink = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }): Promise<ActionResult> => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      return { ok: false, code: "INVALID_EMAIL", message: errorMessageFor("INVALID_EMAIL") };
    }
    const result = await callApi(API_ENDPOINTS.verify, {
      method: "POST",
      body: JSON.stringify({ email: data.email, magicLink: data.magicLink }),
    });
    if (!result) {
      return { ok: false, code: "API_OFFLINE", message: errorMessageFor("API_OFFLINE") };
    }
    if (result.status >= 400 || result.payload["status"] === false) {
      return readableError(result.payload, result.status);
    }

    const payload = result.payload;
    // API asli membungkus data di payload.result: { user: {...}, premium: {...} }
    const nested = (payload["data"] ?? payload["result"] ?? {}) as Record<string, unknown>;
    const userObj = (nested["user"] ?? {}) as Record<string, unknown>;
    const premiumObj = (nested["premium"] ?? nested) as Record<string, unknown>;
    const plan = (premiumObj["plan"] ?? payload["plan"] ?? nested["plan"] ?? {}) as
      | Record<string, unknown>
      | string;
    const planObject = typeof plan === "string" ? { name: plan } : plan;
    const benefits = [premiumObj["benefits"], payload["benefits"], nested["benefits"]].find(
      (value) => Array.isArray(value),
    ) as unknown[] | undefined;

    // uid dan orderId bukan kata sensitif (beda dari idToken/refreshToken),
    // tapi diambil manual karena pickString() men-skip apa saja yang match /token|.../i
    // dan "uid" / "orderId" kebetulan aman dari regex itu — tetap eksplisit biar jelas asalnya.
    const uid =
      typeof userObj["uid"] === "string" && userObj["uid"].trim() !== ""
        ? userObj["uid"]
        : pickString({ ...nested, ...payload }, ["uid"]);
    const orderId =
      typeof premiumObj["orderId"] === "string" && premiumObj["orderId"].trim() !== ""
        ? premiumObj["orderId"]
        : pickString({ ...nested, ...payload }, ["orderId", "order_id"]);

    return {
      ok: true,
      message: "Verifikasi berhasil.",
      data: {
        email: pickString({ ...userObj, ...nested, ...payload }, ["email"]) ?? data.email,
        uid,
        orderId,
        plan: pickString(planObject as Record<string, unknown>, ["name", "type"]),
        duration:
          pickString(planObject as Record<string, unknown>, ["duration"]) ??
          pickString({ ...premiumObj, ...nested, ...payload }, ["duration"]),
        validUntil: pickString({ ...premiumObj, ...nested, ...payload }, [
          "validUntil",
          "expiresAt",
          "expiry",
          "expireAt",
          "until",
        ]),
        benefits: benefits?.filter((b): b is string => typeof b === "string"),
      },
    };
  });
