import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-ink/10 bg-warm-white/60 px-6 py-14 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <p className="text-xl font-bold text-ink">{title}</p>
      <p className="mt-2 max-w-xs text-base text-muted">{body}</p>
      {action && <div className="mt-6 w-full max-w-xs">{action}</div>}
    </div>
  );
}
