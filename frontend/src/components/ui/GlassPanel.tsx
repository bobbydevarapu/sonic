import type { PropsWithChildren } from 'react';

export default function GlassPanel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`glass-panel rounded-3xl ${className}`}>{children}</div>;
}