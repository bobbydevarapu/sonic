import { useEffect } from 'react';

export default function CursorTrail() {
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return <div aria-hidden className="cursor-trail pointer-events-none fixed left-0 top-0 z-0 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />;
}