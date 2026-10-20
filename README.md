# Range · Prueba técnica Next.js (ES)

🇬🇧 [Read in English](README.en.md)

Componente `<Range />` con dos modos de uso:

- **Rango normal** (`/exercise1`): cualquier valor entre un mínimo y un máximo, con etiquetas editables.
- **Rango de valores fijos** (`/exercise2`): solo se pueden seleccionar los valores de una lista, con etiquetas de moneda no editables.

Proyecto Next.js (App Router) + TypeScript montado a mano, sin `create-next-app`.

## Requisitos

- Node.js ≥ 20.9
- pnpm 12 (recomendado, es el gestor con el que se ha desarrollado y el que usa el lockfile). También funciona con npm

Si no tienes pnpm:

```bash
npm install -g pnpm   # o: corepack enable
```

## Instalación y arranque

```bash
pnpm install         # o: npm install
pnpm dev              # o: npm run dev   → http://localhost:8080
```

| Script                        | Descripción                                      |
| ----------------------------- | ------------------------------------------------ |
| `pnpm dev`                    | Servidor de desarrollo en el puerto 8080         |
| `pnpm build` / `pnpm start`   | Build de producción y servidor en el puerto 8080 |
| `pnpm test`                   | Tests unitarios y de integración                 |
| `pnpm test:watch`             | Tests en modo watch                              |
| `pnpm test:coverage`          | Informe de cobertura                             |
| `pnpm typecheck`              | Comprobación de tipos (`tsc --noEmit`)           |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                           |

Con npm, usa npm run "script" (por ejemplo npm run typecheck)

Las versiones de las dependencias están fijadas (`saveExact` + `pnpm-lock.yaml`) para que las instalaciones sean reproducibles.

## Rutas

| Ruta                   | Descripción                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `/`                    | Portada                                                             |
| `/exercise1`           | Rango normal                                                        |
| `/exercise2`           | Rango de valores fijos                                              |
| `GET /api/range`       | Mock: `{ "min": 1, "max": 100 }`                                    |
| `GET /api/fixed-range` | Mock: `{ "rangeValues": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }` |

Los servicios mockeados son Route Handlers de Next (`app/api/*/route.ts`), sin dependencias externas.

## Estructura

```
app/
  layout.tsx                 layout raíz (estilos globales + navegación)
  page.tsx                   portada
  exercise1/                 página + componente cliente que carga /api/range
  exercise2/                 página + componente cliente que carga /api/fixed-range
  api/range/route.ts         mock del ejercicio 1
  api/fixed-range/route.ts   mock del ejercicio 2
components/
  range/                     Range, ContinuousRange, FixedRange, RangeTrack, EditableLabel
  navigation/                cabecera con enlaces
hooks/                       useRangeDrag (arrastre), useAsync (carga de datos)
services/                    rangeService (llamadas HTTP)
types/                       tipos de las respuestas y de las props
utils/                       funciones puras (range, format, keyboard)
styles/                      estilos globales y variables CSS
test/                        utilidades compartidas de test
```

## Decisiones de diseño

**Un solo componente, dos modos.** `Range` recibe una unión discriminada (`mode: "continuous" | "fixed"`): TypeScript impide, por ejemplo, pasar `values` en modo continuo. Cada modo tiene su componente (`ContinuousRange` guarda valores, `FixedRange` guarda índices) y ambos pintan el mismo `RangeTrack`, que solo se encarga de la vista.

**Arrastre compartido.** `useRangeDrag` usa Pointer Events y `setPointerCapture` (funciona con ratón, táctil y lápiz y no se corta si el puntero sale del handle). El hook solo informa de la posición en porcentaje; cada modo la convierte en valor (con redondeo al `step`) o en índice (snap al valor más cercano).

**Los handles no se cruzan ni se igualan.** Siempre queda como mínimo un `step` (modo normal) o una posición (modo fijo) entre el mínimo y el máximo.

**Etiquetas del ejercicio 1.** Cada etiqueta es un botón que, al pulsarlo, se convierte en un `input type="number"`. Enter o perder el foco confirma, Escape cancela y un valor vacío o inválido mantiene el anterior. El valor escrito se limita igual que al arrastrar. Se editan los valores seleccionados, no los límites del servicio.

**Carga de datos en el cliente.** Cada `page.tsx` es un Server Component (título y metadata) que pinta un componente cliente. Ese componente llama al servicio mediante `useAsync`, que expone `loading | error | success`. Se hace en el cliente porque el servicio usa URLs relativas, porque llamar al propio Route Handler desde el servidor requeriría una URL absoluta y porque así las páginas se pueden testear con Jest. Por eso los estados de carga y error se gestionan en el componente y no con `loading.tsx` / `error.tsx`.

**Componente agnóstico del formato.** `FixedRange` recibe un `formatValue` opcional; la página del ejercicio 2 le pasa `formatCurrency` (`Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })`).

**Rendimiento.** No se actualiza el estado ni se llama a `onChange` si el valor no cambia, y el formateador de moneda se crea una sola vez. No se usa `useMemo`/`useCallback`: el árbol es muy pequeño.

## Supuestos

- En el ejercicio 2 el enunciado vuelve a pedir "un servicio que devuelva los valores mínimo y máximo" con el ejemplo `{ rangeValues: [] }`. Se interpreta que el mínimo y el máximo del rango son el primer y el último valor del array.
- Si el servicio devuelve menos de dos valores, la página muestra un aviso en lugar del componente.
- Se asume que `rangeValues` llega ordenado de menor a mayor.

## Testing

Jest + React Testing Library + user-event, configurado con `next/jest`.

- **Unitarios:** funciones puras (`utils/`), servicio con `fetch` simulado y Route Handlers.
- **Hooks:** `useAsync` y `useRangeDrag`.
- **Componentes:** `EditableLabel` y `Range` en ambos modos (arrastre, redondeo, límites, no cruce, etiquetas, formato de moneda, snap y teclado).
- **Integración:** `Exercise1Range` y `Exercise2Range` con el servicio mockeado (carga, datos, error y lista vacía).

13 suites, 103 tests y ~98 % de cobertura de líneas.

Los tests están junto al archivo que prueban. jsdom no implementa `PointerEvent`, `setPointerCapture` ni el layout, así que `jest.setup.ts` añade un polyfill mínimo y `test/pointer.ts` simula las medidas del track.

## Herramientas

- ESLint 10 con configuración flat (`eslint.config.mjs`) y `eslint-config-next`.
- TypeScript 6: `typescript-eslint`, que usa `eslint-config-next`, aún no soporta TypeScript 7.
- `jest.config.mjs` en lugar de `.ts`: el proyecto es `"type": "module"` y un config en TypeScript necesitaría `ts-node`.

## Limitaciones y posibles mejoras

- El componente es no controlado: si `min`/`max` cambian después de montarse, el estado no se resincroniza. Se podría añadir una prop `value` controlada.
- No se valida ni se ordena `rangeValues`, ni se comprueba un `defaultValue` con los valores cruzados.
- `onChange` se emite en cada movimiento; un `onChangeEnd` sería útil para peticiones costosas.
- No hay botón de reintento cuando falla la carga.
- Los textos accesibles están en español en el código; para i18n deberían llegar por props.
