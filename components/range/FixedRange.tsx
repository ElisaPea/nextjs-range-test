import { useState } from "react";
import type { FixedRangeProps } from "@/types/range";
import {
  clamp,
  findClosestIndex,
  indexToPercent,
  percentToIndex,
} from "@/utils/range";
import { RangeTrack } from "./RangeTrack";
import type { HandleId } from "@/hooks/useRangeDrag";
import type { KeyAction } from "@/utils/keyboard";

export function FixedRange({
  values,
  defaultValue,
  label,
  onChange,
  formatValue = String,
}: FixedRangeProps) {
  const [indices, setIndices] = useState(() => ({
    min: defaultValue ? findClosestIndex(values, defaultValue.min) : 0,
    max: defaultValue
      ? findClosestIndex(values, defaultValue.max)
      : values.length - 1,
  }));

  if (values.length < 2) return null;

  const lastIndex = values.length - 1;

  const setHandleIndex = (handle: HandleId, newIndex: number) => {
    const next =
      handle === "min"
        ? { ...indices, min: clamp(newIndex, 0, indices.max - 1) }
        : { ...indices, max: clamp(newIndex, indices.min + 1, lastIndex) };

    if (next.min === indices.min && next.max === indices.max) return;

    setIndices(next);
    onChange?.({ min: values[next.min], max: values[next.max] });
  };

  const handleMove = (handle: HandleId, percent: number) => {
    setHandleIndex(handle, percentToIndex(percent, values.length));
  };

  const handleKey = (handle: HandleId, action: KeyAction) => {
    if (action.type === "edge") {
      setHandleIndex(handle, action.edge === "start" ? 0 : lastIndex);
      return;
    }
    setHandleIndex(handle, indices[handle] + action.steps);
  };

  const min = values[indices.min];
  const max = values[indices.max];

  return (
    <RangeTrack
      label={label}
      onHandleMove={handleMove}
      onHandleKey={handleKey}
      minHandle={{
        percent: indexToPercent(indices.min, values.length),
        ariaLabel: "Valor mínimo",
        values: { min: values[0], max, currentValue: min },
        valueText: formatValue(min),
      }}
      maxHandle={{
        percent: indexToPercent(indices.max, values.length),
        ariaLabel: "Valor máximo",
        values: { min, max: values[lastIndex], currentValue: max },
        valueText: formatValue(max),
      }}
      minLabel={formatValue(min)}
      maxLabel={formatValue(max)}
    />
  );
}
