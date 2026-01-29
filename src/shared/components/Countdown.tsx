import { useCountdown } from "@/shared/hooks/useCountdown";

export type CountdownFormat = "seconds" | "mmss";

// 포맷팅
const formatSeconds = (ms: number) => Math.ceil(ms / 1000);
const formatMmSs = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

interface CountdownProps {
  durationMs: number;
  onComplete?: () => void;
  autoStart?: boolean;
  format?: CountdownFormat;
  className?: string;
  initialStartTime?: number; // 타이머 시작 시각 (ms, Date.now())
}

export const Countdown = ({
  durationMs,
  onComplete,
  autoStart = true,
  format = "seconds",
  className,
  initialStartTime,
}: CountdownProps) => {
  const remaining = useCountdown(
    durationMs,
    onComplete,
    autoStart,
    initialStartTime,
  );

  const displayText =
    format === "mmss" ? formatMmSs(remaining) : formatSeconds(remaining);

  return <span className={className}>{displayText}</span>;
};

export default Countdown;
