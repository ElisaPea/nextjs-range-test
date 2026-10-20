"use client";

import { Range } from "@/components/range";
import { useAsync } from "@/hooks/useAsync";
import { getFixedRangeValues } from "@/services/rangeService";
import { formatCurrency } from "@/utils/format";

export function Exercise2Range() {
  const state = useAsync(getFixedRangeValues);

  if (state.status === "loading") {
    return <p role="status">Cargando valores…</p>;
  }

  if (state.status === "error") {
    return (
      <p role="alert">
        No se han podido cargar los valores. Inténtalo de nuevo más tarde.
      </p>
    );
  }

  const { rangeValues } = state.data;

  if (rangeValues.length < 2) {
    return (
      <p role="alert">No hay suficientes valores para mostrar el rango.</p>
    );
  }

  return (
    <Range
      mode="fixed"
      values={rangeValues}
      formatValue={formatCurrency}
      label="Precio"
    />
  );
}
