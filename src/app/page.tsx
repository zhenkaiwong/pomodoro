import Clock from "@/lib/components/Clock";

export default function Home() {
  const focusDuration = Number(process.env.FOCUS_DURATION || 0.25);
  const restDuration = Number(process.env.REST_DURATION || 0.25);

  return <Clock focusDuration={focusDuration} restDuration={restDuration} />;
}
