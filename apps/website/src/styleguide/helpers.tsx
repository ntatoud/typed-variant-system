export function DemoGroup({
  label,
  children,
  vertical = false,
}: {
  label: string;
  children: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <div className={vertical ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2"}>
        {children}
      </div>
    </div>
  );
}

export function DemoSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
