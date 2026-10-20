import { useState } from "react";
import type { ContinuousRangeProps, RangeValue } from "@/types/range";
import { clamp, valueToPercent } from "@/utils/range";
import { RangeTrack } from "./RangeTrack";

export function ContinuousRange({
  min,
  max,
  defaultValue,
  label,
}: ContinuousRangeProps) {
  const [value] = useState<RangeValue>(() => ({
    min: clamp(defaultValue?.min ?? min, min, max),
    max: clamp(defaultValue?.max ?? max, min, max),
  }));

  return (
    <RangeTrack
      label={label}
      minHandle={{
        percent: valueToPercent(value.min, min, max),
        ariaLabel: "Valor mínimo",
        values: { min, max: value.max, currentValue: value.min },
      }}
      maxHandle={{
        percent: valueToPercent(value.max, min, max),
        ariaLabel: "Valor máximo",
        values: { min: value.min, max, currentValue: value.max },
      }}
      minLabel={value.min}
      maxLabel={value.max}
    />
  );
}
