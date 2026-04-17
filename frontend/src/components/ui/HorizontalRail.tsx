import type { PropsWithChildren, WheelEvent } from 'react';

export default function HorizontalRail({ children }: PropsWithChildren) {
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      target.scrollLeft += event.deltaY;
    }
  };

  return (
    <div className="no-scrollbar overflow-x-auto pb-2 [scrollbar-width:none]" onWheel={onWheel}>
      <div className="flex min-w-0 snap-x snap-mandatory gap-3 sm:gap-4">{children}</div>
    </div>
  );
}