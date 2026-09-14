const API = "https://app.unlimitedai.chat/api/chat";

const UA =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function buildCookie(deviceId: string, chatId: string): string {
  return Object.entries({
    NEXT_LOCALE: "id",
    u_device_id: deviceId,
    home_chat_id: chatId,
  })
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

async function unlimitedAIChat({
  systemPrompt,
  messages,
}: {
  systemPrompt: string;
  messages: ChatMessage[];
}): Promise<Response> {
  const chatId = crypto.randomUUID();
  const deviceId = crypto.randomUUID();
  const now = new Date().toISOString();

  const fullMessages = [
    {
      id: crypto.randomUUID(),
      role: "system",
      content: systemPrompt,
      parts: [{ type: "text", text: systemPrompt }],
      createdAt: now,
    },
    ...messages.map((m) => ({
      id: crypto.randomUUID(),
      role: m.role,
      content: m.content,
      parts: [{ type: "text", text: m.content }],
      createdAt: now,
    })),
  ];

  const body = {
    chatId,
    messages: fullMessages,
    selectedChatModel: "chat-model-reasoning",
    selectedCharacter: null,
    selectedStory: null,
    deviceId,
    locale: "id",
  };

  const headers: Record<string, string> = {
    "sec-ch-ua-platform": `"Android"`,
    "user-agent": UA,
    "sec-ch-ua": `"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"`,
    "content-type": "application/json",
    "sec-ch-ua-mobile": "?1",
    "x-next-intl-locale": "id",
    accept: "*/*",
    origin: "https://app.unlimitedai.chat",
    referer: "https://app.unlimitedai.chat/id",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    cookie: buildCookie(deviceId, chatId),
    priority: "u=1, i",
  };

  const response = await fetch(API, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new Error(`UnlimitedAI request failed (${response.status}): ${text}`);
  }

  return response;
}

export async function* streamUnlimitedAI({
  systemPrompt,
  messages,
}: {
  systemPrompt: string;
  messages: ChatMessage[];
}): AsyncGenerator<string> {
  const response = await unlimitedAIChat({ systemPrompt, messages });
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      try {
        const json = JSON.parse(line);
        if (json.type === "delta" && typeof json.delta === "string") {
          yield json.delta;
        }
      } catch {
        // ignore malformed lines from the upstream stream
      }
    }
  }
}
