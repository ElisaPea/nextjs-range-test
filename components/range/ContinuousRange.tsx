import { useState } from "react";
import type { ContinuousRangeProps, RangeValue } from "@/types/range";
import {
  clamp,
  percentToValue,
  roundToStep,
  valueToPercent,
} from "@/utils/range";
import { RangeTrack } from "./RangeTrack";
import type { HandleId } from "../../hooks/useRangeDrag";
import { EditableLabel } from "./EditableLabel";
import type { KeyAction } from "@/utils/keyboard";

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

  const updateValue = (next: RangeValue) => {
    if (next.min === value.min && next.max === value.max) return;
    setValue(next);
    onChange?.(next);
  };

  /** Aplica redondeo, límites y regla de no cruce a un valor nuevo para un handle */
  const setHandleValue = (handle: HandleId, newValue: number) => {
    const rounded = roundToStep(newValue, step, min);

    updateValue(
      handle === "min"
        ? { ...value, min: clamp(rounded, min, value.max - step) }
        : { ...value, max: clamp(rounded, value.min + step, max) },
    );
  };

  const handleMove = (handle: HandleId, percent: number) => {
    setHandleValue(handle, percentToValue(percent, min, max));
  };

  const handleKey = (handle: HandleId, action: KeyAction) => {
    if (action.type === "edge") {
      setHandleValue(handle, action.edge === "start" ? min : max);
      return;
    }
    setHandleValue(handle, value[handle] + action.steps * step);
  };

  return (
    <RangeTrack
      label={label}
      onHandleMove={handleMove}
      onHandleKey={handleKey}
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
      minLabel={
        <EditableLabel
          value={value.min}
          ariaLabel="Valor mínimo"
          onCommit={(newValue) => setHandleValue("min", newValue)}
        />
      }
      maxLabel={
        <EditableLabel
          value={value.max}
          ariaLabel="Valor máximo"
          onCommit={(newValue) => setHandleValue("max", newValue)}
        />
      }
    />
  );
}
