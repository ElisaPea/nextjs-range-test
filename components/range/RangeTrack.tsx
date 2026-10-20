import { useRef, type ReactNode } from "react";
import styles from "./Range.module.css";
import {
  useRangeDrag,
  type HandleDragProps,
  type HandleId,
} from "../../hooks/useRangeDrag";

export interface TrackHandle {
  /** Posición en el track (0-100) */
  percent: number;
  ariaLabel: string;
  values: { min: number; max: number; currentValue: number };
  valueText?: string;
}

interface RangeTrackProps {
  label?: string;
  minHandle: TrackHandle;
  maxHandle: TrackHandle;
  minLabel: ReactNode;
  maxLabel: ReactNode;
  onHandleMove: (handle: HandleId, percent: number) => void;
}
type HandleProps = TrackHandle & HandleDragProps & { isDragging: boolean };

function Handle({
  percent,
  ariaLabel,
  values,
  valueText,
  isDragging,
  ...dragProps
}: HandleProps) {
  return (
    <div
      role="slider"
      tabIndex={0}
      className={
        isDragging ? `${styles.handle} ${styles.dragging}` : styles.handle
      }
      style={{ left: `${percent}%` }}
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      aria-valuenow={values.currentValue}
      aria-valuemin={values.min}
      aria-valuemax={values.max}
      aria-valuetext={valueText}
      {...dragProps}
    />
  );
}

export function RangeTrack({
  label,
  minHandle,
  maxHandle,
  minLabel,
  maxLabel,
  onHandleMove,
}: RangeTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeHandle, getHandleProps } = useRangeDrag({
    trackRef,
    onDrag: onHandleMove,
  });

  return (
    <div className={styles.range} role="group" aria-label={label}>
      <div className={styles.label}>{minLabel}</div>

      <div ref={trackRef} className={styles.track}>
        <div
          className={styles.selected}
          style={{
            left: `${minHandle.percent}%`,
            width: `${maxHandle.percent - minHandle.percent}%`,
          }}
        />
        <Handle
          {...minHandle}
          isDragging={activeHandle === "min"}
          {...getHandleProps("min")}
        />
        <Handle
          {...maxHandle}
          isDragging={activeHandle === "max"}
          {...getHandleProps("max")}
        />
      </div>

      <div className={styles.label}>{maxLabel}</div>
    </div>
  );
}
