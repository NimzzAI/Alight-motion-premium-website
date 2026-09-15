import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "nimzz_ai_chat_history";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Haii, aku Nimzz AI \u{1F44B} Kalau kamu stuck pas proses aktivasi \u2014 terutama bagian abis kirim link, harus ngapain \u2014 tanya aku aja di sini, aku bantu step by step.",
};

const SUGGESTIONS = [
  "Abis kirim link, terus ngapain?",
  "Emailnya nggak ketemu, gimana?",
  "Link-nya udah expired",
];

function renderContent(content: string) {
  return content.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < content.split("\n").length - 1 && <br />}
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
          content: "Waduh, koneksinya lagi bermasalah. Coba tanya lagi sebentar ya.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingText("");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
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
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          >
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500" />
              <h4 className="text-sm font-semibold">Nimzz AI</h4>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset chat"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <i className="fa-regular fa-trash-can text-sm" aria-hidden="true" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
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
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-foreground"
                  }`}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl bg-surface px-3 py-2 text-sm leading-relaxed text-foreground">
                  {streamingText ? (
                    renderContent(streamingText)
                  ) : (
                    <span className="text-muted-foreground">Mengetik...</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={isLoading}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Nimzz AI lagi mikir..." : "Tulis pertanyaanmu..."}
              disabled={isLoading}
              className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <i className="fa-solid fa-paper-plane text-sm" aria-hidden="true" />
            </Button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Tutup Nimzz AI" : "Buka Nimzz AI"}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <i
          className={`fa-solid ${isOpen ? "fa-xmark" : "fa-comment-dots"} text-xl`}
          aria-hidden="true"
        />
      </button>
      </div>
    </>
  );
}
