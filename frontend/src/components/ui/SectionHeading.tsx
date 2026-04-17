import type { ReactNode } from 'react';

export default function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="si-font-heading mb-2 text-xs uppercase tracking-[0.35em] text-cyan-300/80">{eyebrow}</p> : null}
        <h2 className="si-font-display text-xl font-semibold text-white sm:text-2xl md:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}