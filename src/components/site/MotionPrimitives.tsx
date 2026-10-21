import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -32px 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenClass = {
    up: "reveal-hidden-up",
    left: "reveal-hidden-left",
    right: "reveal-hidden-right",
    scale: "reveal-hidden-scale",
  }[direction];

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transitionDelay: delay > 0 ? `${delay}ms` : undefined,
      }}
      className={`reveal-base ${visible ? "reveal-visible" : hiddenClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface SpotlightSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  as?: "div" | "article" | "section";
  interactive?: boolean;
}

export function SpotlightSurface({
  children,
  className = "",
  as: Tag = "div",
  interactive = true,
  ...rest
}: SpotlightSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      node.style.setProperty("--mouse-x", `${x}px`);
      node.style.setProperty("--mouse-y", `${y}px`);
      rafRef.current = null;
    });
  }, []);

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`spotlight-card rounded-2xl border border-border bg-card shadow-soft ${
        interactive ? "motion-surface" : ""
      } ${className}`}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}

export function SectionIndex({
  index,
  label,
  detail,
}: {
  index: string;
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="font-mono font-semibold text-primary tabular-nums">{index}</span>
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      <span className="font-medium text-foreground">{label}</span>
      {detail && (
        <>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span>{detail}</span>
        </>
      )}
    </div>
  );
}

type PipelineNode = {
  icon: string;
  title: string;
  subtitle: string;
};

const defaultNodes: PipelineNode[] = [
  {
    icon: "fa-solid fa-envelope",
    title: "Email",
    subtitle: "Masukkan email aktif",
  },
  {
    icon: "fa-solid fa-globe",
    title: "Website",
    subtitle: "Teruskan permintaan",
  },
  {
    icon: "fa-solid fa-server",
    title: "API",
    subtitle: "Proses verifikasi",
  },
  {
    icon: "fa-solid fa-paper-plane",
    title: "Email Dikirim",
    subtitle: "Link masuk ke Inbox/Spam",
  },
];

export function SignalPipeline({
  nodes = defaultNodes,
  compact = false,
}: {
  nodes?: PipelineNode[];
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface/70 ${compact ? "p-4" : "p-5 sm:p-6"}`}
      aria-label="Alur pengiriman link aktivasi"
    >
      <div className="grid gap-3 sm:grid-cols-4">
        {nodes.map((node, idx) => (
          <div
            key={node.title}
            className="relative flex items-center gap-3 sm:flex-col sm:items-start"
          >
            <div className="flex w-full items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary shadow-2xs transition-transform duration-300 hover:scale-105">
                <i className={`${node.icon} text-sm`} aria-hidden="true" />
              </div>
              {idx < nodes.length - 1 && (
                <div
                  className="relative hidden h-[2px] flex-1 overflow-hidden rounded-full bg-border sm:block"
                  aria-hidden="true"
                >
                  <div
                    className="animate-packet absolute inset-y-0 left-0 w-1/2 rounded-full bg-primary"
                    style={{ animationDelay: `${idx * 350}ms` }}
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 sm:mt-1.5">
              <p className="truncate text-xs font-semibold text-foreground">{node.title}</p>
              <p className="truncate text-[11px] text-muted-foreground">{node.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
