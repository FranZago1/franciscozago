export function Tag({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "strong" }) {
  const styles =
    tone === "strong"
      ? "bg-ink text-white"
      : "border border-line text-muted";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-sm leading-none ${styles}`}>{children}</span>
  );
}
