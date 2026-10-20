import { useState, type PointerEvent, type RefObject } from "react";
import { getPointerPercent } from "@/utils/range";

export type HandleId = "min" | "max";

export interface HandleDragProps {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
}

interface UseRangeDragOptions {
  trackRef: RefObject<HTMLElement | null>;
  onDrag: (handle: HandleId, percent: number) => void;
}

/** Gestiona el arrastre de los handes y notifica la posición del puntero en % del track */
export function useRangeDrag({ trackRef, onDrag }: UseRangeDragOptions) {
  const [activeHandle, setActiveHandle] = useState<HandleId | null>(null);

  const endDrag = () => setActiveHandle(null);

  const getHandleProps = (handle: HandleId): HandleDragProps => ({
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setActiveHandle(handle);
    },
    onPointerMove: (event) => {
      if (activeHandle !== handle || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      onDrag(handle, getPointerPercent(event.clientX, rect));
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  });

  return { activeHandle, getHandleProps };
}
