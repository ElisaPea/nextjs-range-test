/** Respuesta de /api/range: límites del rango continuo */
export interface RangeLimits {
  min: number;
  max: number;
}

/** Respuesta de /api/fixed-range: valores permitidos del rango fijo */
export interface FixedRangeResponse {
  rangeValues: number[];
}

/** Valores seleccionados en el Range */
export interface RangeValue {
  min: number;
  max: number;
}

/** Props base compartidas entre ambos componentes */
interface BaseRangeProps {
  label?: string;
  onChange?: (value: RangeValue) => void;
}

/** Props específicas del Range continuo */
export interface ContinuousRangeProps extends BaseRangeProps {
  mode: "continuous";
  min: number;
  max: number;
  step?: number;
  defaultValue?: RangeValue;
}

/** Props específicas del Range fijo */
export interface FixedRangeProps extends BaseRangeProps {
  mode: "fixed";
  values: number[];
  defaultValue?: RangeValue;
  formatValue?: (value: number) => string;
}

/** Tipado del componente Range */
export type RangeProps = ContinuousRangeProps | FixedRangeProps;
