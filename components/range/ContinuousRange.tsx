import { useState } from "react";
import type { ContinuousRangeProps, RangeValue } from "@/types/range";
import {
  clamp,
  percentToValue,
  roundToStep,
  valueToPercent,
} from "@/utils/range";
import { RangeTrack } from "./RangeTrack";
import type { HandleId } from "./useRangeDrag";

export function ContinuousRange({
  min,
  max,
  step = 1,
  defaultValue,
  label,
  onChange,
}: ContinuousRangeProps) {
  const [value, setValue] = useState<RangeValue>(() => ({
    min: clamp(defaultValue?.min ?? min, min, max),
    max: clamp(defaultValue?.max ?? max, min, max),
  }));

  const handleMove = (handle: HandleId, percent: number) => {
    const newValue = roundToStep(percentToValue(percent, min, max), step, min);

    const next: RangeValue =
      handle === "min"
        ? { ...value, min: clamp(newValue, min, value.max - step) }
        : { ...value, max: clamp(newValue, value.min + step, max) };

    if (next.min === value.min && next.max === value.max) return;

    setValue(next);
    onChange?.(next);
  };

  return (
    <RangeTrack
      label={label}
      onHandleMove={handleMove}
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
