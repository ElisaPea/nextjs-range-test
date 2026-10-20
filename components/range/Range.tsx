"use client";

import type { RangeProps } from "@/types/range";
import { ContinuousRange } from "./ContinuousRange";
import { FixedRange } from "./FixedRange";

export function Range(props: RangeProps) {
  return props.mode === "fixed" ? (
    <FixedRange {...props} />
  ) : (
    <ContinuousRange {...props} />
  );
}
