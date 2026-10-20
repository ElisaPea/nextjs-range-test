import { useState } from "react";
import type { FixedRangeProps } from "@/types/range";
import { findClosestIndex, indexToPercent } from "@/utils/range";
import { RangeTrack } from "./RangeTrack";

export function FixedRange({ values, defaultValue, label }: FixedRangeProps) {
  const [indices] = useState(() => ({
    min: defaultValue ? findClosestIndex(values, defaultValue.min) : 0,
    max: defaultValue
      ? findClosestIndex(values, defaultValue.max)
      : values.length - 1,
  }));

  if (values.length < 2) return null;

  const min = values[indices.min];
  const max = values[indices.max];

  return (
    <RangeTrack
      label={label}
      minHandle={{
        percent: indexToPercent(indices.min, values.length),
        ariaLabel: "Valor mínimo",
        values: { min: values[0], max, currentValue: min },
        valueText: String(min),
      }}
      maxHandle={{
        percent: indexToPercent(indices.max, values.length),
        ariaLabel: "Valor máximo",
        values: { min, max: values[values.length - 1], currentValue: max },
        valueText: String(max),
      }}
      minLabel={min}
      maxLabel={max}
    />
  );
}
