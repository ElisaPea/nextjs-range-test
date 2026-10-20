"use client";

import { Range } from "@/components/range";
import { useAsync } from "@/hooks/useAsync";
import { getRangeLimits } from "@/services/rangeService";

export function Exercise1Range() {
  const state = useAsync(getRangeLimits);

  if (state.status === "loading") {
    return <p role="status">Cargando rango…</p>;
  }

  if (state.status === "error") {
    return (
      <p role="alert">
        No se ha podido cargar el rango. Inténtalo de nuevo más tarde.
      </p>
    );
  }

  const { min, max } = state.data;

  return <Range mode="continuous" min={min} max={max} label="Precio" />;
}
