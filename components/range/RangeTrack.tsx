import type { ReactNode } from "react";
import styles from "./Range.module.css";

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
}

function Handle({ percent, ariaLabel, values, valueText }: TrackHandle) {
  return (
    <div
      role="slider"
      tabIndex={0}
      className={styles.handle}
      style={{ left: `${percent}%` }}
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      aria-valuenow={values.currentValue}
      aria-valuemin={values.min}
      aria-valuemax={values.max}
      aria-valuetext={valueText}
    />
  );
}

export function RangeTrack({
  label,
  minHandle,
  maxHandle,
  minLabel,
  maxLabel,
}: RangeTrackProps) {
  return (
    <div className={styles.range} role="group" aria-label={label}>
      <div className={styles.label}>{minLabel}</div>

      <div className={styles.track}>
        <div
          className={styles.selected}
          style={{
            left: `${minHandle.percent}%`,
            width: `${maxHandle.percent - minHandle.percent}%`,
          }}
        />
        <Handle {...minHandle} />
        <Handle {...maxHandle} />
      </div>

      <div className={styles.label}>{maxLabel}</div>
    </div>
  );
}
