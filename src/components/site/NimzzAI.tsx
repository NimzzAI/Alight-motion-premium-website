import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "nimzz_ai_chat_history";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Halo, saya Nimzz AI. Jika kamu mengalami kendala saat proses aktivasi — terutama setelah mengirim tautan email — silakan tanyakan di sini untuk panduan langkah demi langkah.",
};

const SUGGESTIONS = [
  "Abis kirim link, terus ngapain?",
  "Emailnya nggak ketemu, gimana?",
  "Link-nya udah expired",
];

function renderContent(content: string) {
  return content.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export function NimzzAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1 || messages[0]?.content !== INITIAL_MESSAGE.content) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        // ignore storage quota errors
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingText, isOpen]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingText("");

    try {
      const response = await fetch("/api/nimzz-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages.slice(-10) }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingText(full);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: full.trim() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Koneksi asisten sedang mengalami gangguan. Silakan coba sesaat lagi.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingText("");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleReset() {
    setMessages([INITIAL_MESSAGE]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="fixed right-4 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-end gap-3 lg:bottom-5">
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-step-enter flex h-[68vh] max-h-[540px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-card shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-primary">
                  <i className="fa-solid fa-headset text-xs" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold leading-none text-foreground">Nimzz AI</h4>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    Asisten Panduan Aktivasi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Bersihkan riwayat percakapan"
                  className="motion-press rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <i className="fa-regular fa-trash-can text-xs" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup jendela bantuan"
                  className="motion-press rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface text-foreground"
                    }`}
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
                    {streamingText ? (
                      renderContent(streamingText)
                    ) : (
                      <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <i
                          className="fa-solid fa-circle-notch fa-spin text-primary"
                          aria-hidden="true"
                        />
                        <span>Menyiapkan jawaban...</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 border-t border-border bg-surface/50 px-3 py-2.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void sendMessage(s)}
                    disabled={isLoading}
                    className="motion-press rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-border bg-card p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? "Memproses..." : "Tanyakan langkah aktivasi..."}
                disabled={isLoading}
                className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none"
              />
              <Button
                type="submit"
                size="icon"
                className="motion-press h-9 w-9 shrink-0"
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pesan"
              >
                <i className="fa-solid fa-paper-plane text-xs" aria-hidden="true" />
              </Button>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Tutup asisten Nimzz AI" : "Buka asisten Nimzz AI"}
          className="motion-press flex h-12 items-center gap-2.5 rounded-xl border border-primary/20 bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-lift hover:bg-primary/92"
        >
          <i
            className={`fa-solid ${isOpen ? "fa-xmark" : "fa-headset"} text-sm`}
            aria-hidden="true"
          />
          <span>{isOpen ? "Tutup Bantuan" : "Tanya Nimzz AI"}</span>
        </button>
      </div>
    </>
  );
}
