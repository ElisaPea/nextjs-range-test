/** Restringe un valor a un intervalo dado (min, max)  */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Convierte un valor dentro de un intervalo dado (min, max) a un porcentaje (0-100)  */
export function valueToPercent(
  value: number,
  min: number,
  max: number,
): number {
  if (max === min) return 0;
  return ((clamp(value, min, max) - min) / (max - min)) * 100;
}

/** Convierte un porcentaje (0-100) a un valor dentro de un intervalo dado (min, max). */
export function percentToValue(
  percent: number,
  min: number,
  max: number,
): number {
  return min + (clamp(percent, 0, 100) / 100) * (max - min);
}

/** Redondea un valor a un múltiplo de step, centrado en min. */
export function roundToStep(value: number, step: number, min = 0): number {
  if (step <= 0) return value;
  return Math.round((value - min) / step) * step + min;
}

/** Calcula el porcentaje de la posición del puntero respecto al ancho del elemento. */
export function getPointerPercent(
  clientX: number,
  rect: Pick<DOMRect, "left" | "width">,
): number {
  if (rect.width === 0) return 0;
  return clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
}

/** Busca el índice del valor más cercano en un array ordenado. */
export function findClosestIndex(
  values: readonly number[],
  target: number,
): number {
  if (values.length === 0) return -1;

  return values.reduce(
    (closestIndex, value, index) =>
      Math.abs(value - target) < Math.abs(values[closestIndex] - target)
        ? index
        : closestIndex,
    0,
  );
}

/** Calcula el porcentaje que ocupa un índice en un rango de conteo (0-100). */
export function indexToPercent(index: number, count: number): number {
  if (count <= 1) return 0;
  return (index / (count - 1)) * 100;
}

/** Calcula el índice que ocupa un porcentaje en un rango de conteo. */
export function percentToIndex(percent: number, count: number): number {
  if (count <= 1) return 0;
  return Math.round((clamp(percent, 0, 100) / 100) * (count - 1));
}
