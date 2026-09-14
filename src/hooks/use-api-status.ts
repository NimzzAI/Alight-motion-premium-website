import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getHealth, getInfo } from "@/lib/am-api.functions";

export function useApiHealth() {
  const fetchHealth = useServerFn(getHealth);
  return useQuery({
    queryKey: ["api-health"],
    queryFn: () => fetchHealth(),
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useApiInfo() {
  const fetchInfo = useServerFn(getInfo);
  return useQuery({
    queryKey: ["api-info"],
    queryFn: () => fetchInfo(),
    staleTime: 5 * 60000,
  });
}

export function formatUptime(seconds?: number) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) return "—";
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours > 0) return `${hours} jam ${minutes} menit`;
  if (minutes > 0) return `${minutes} menit ${secs} detik`;
  return `${secs} detik`;
}

export function formatTime(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "medium" });
}
