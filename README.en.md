# Range · Next.js technical test (EN)

🇪🇸 [Leer en español](README.md)

A `<Range />` component with two usage modes:

- **Normal range** (`/exercise1`): any value between a minimum and a maximum, with editable labels.
- **Fixed values range** (`/exercise2`): only values from a given list can be selected, with read-only currency labels.

Next.js (App Router) + TypeScript project set up manually, without `create-next-app`.

## Requirements

- Node.js ≥ 20.9
- pnpm 12 (recommended: it's the package manager used during development and the one the lockfile is for). npm works too.

If you don't have pnpm:

```bash
npm install -g pnpm   # or: corepack enable
```

## Install and run

```bash
pnpm install          # or: npm install
pnpm dev              # or: npm run dev   → http://localhost:8080
```

| Script                        | Description                              |
| ----------------------------- | ---------------------------------------- |
| `pnpm dev`                    | Development server on port 8080          |
| `pnpm build` / `pnpm start`   | Production build and server on port 8080 |
| `pnpm test`                   | Unit and integration tests               |
| `pnpm test:watch`             | Tests in watch mode                      |
| `pnpm test:coverage`          | Coverage report                          |
| `pnpm typecheck`              | Type checking (`tsc --noEmit`)           |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                   |

With npm, use npm run "script" (e.g. npm run typecheck).

Dependency versions are pinned (`saveExact` + `pnpm-lock.yaml`) so installs are reproducible.

## Routes

| Route                  | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `/`                    | Home                                                                |
| `/exercise1`           | Normal range                                                        |
| `/exercise2`           | Fixed values range                                                  |
| `GET /api/range`       | Mock: `{ "min": 1, "max": 100 }`                                    |
| `GET /api/fixed-range` | Mock: `{ "rangeValues": [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] }` |

The mocked services are Next Route Handlers (`app/api/*/route.ts`), with no external dependencies.

## Structure

```
app/
  layout.tsx                 root layout (global styles + navigation)
  page.tsx                   home
  exercise1/                 page + client component that loads /api/range
  exercise2/                 page + client component that loads /api/fixed-range
  api/range/route.ts         exercise 1 mock
  api/fixed-range/route.ts   exercise 2 mock
components/
  range/                     Range, ContinuousRange, FixedRange, RangeTrack, EditableLabel
  navigation/                header with links
hooks/                       useRangeDrag (dragging), useAsync (data loading)
services/                    rangeService (HTTP calls)
types/                       response and props types
utils/                       pure functions (range, format, keyboard)
styles/                      global styles and CSS variables
test/                        shared test utilities
```

## Design decisions

**One component, two modes.** `Range` takes a discriminated union (`mode: "continuous" | "fixed"`): TypeScript prevents, for example, passing `values` in continuous mode. Each mode has its own component (`ContinuousRange` stores values, `FixedRange` stores indices) and both render the same `RangeTrack`, which only handles the view.

**Shared dragging.** `useRangeDrag` uses Pointer Events and `setPointerCapture` (works with mouse, touch and pen, and doesn't break if the pointer leaves the handle). The hook only reports the position as a percentage; each mode converts it into a value (rounded to `step`) or an index (snapping to the closest value).

**Handles can't cross or be equal.** There is always at least one `step` (normal mode) or one position (fixed mode) between the minimum and the maximum.

**Exercise 1 labels.** Each label is a button that turns into an `input type="number"` when clicked. Enter or blur confirms, Escape cancels, and an empty or invalid value keeps the previous one. The typed value is clamped the same way as when dragging. Labels edit the selected values, not the limits returned by the service.

**Client-side data loading.** Each `page.tsx` is a Server Component (title and metadata) that renders a client component. That component calls the service through `useAsync`, which exposes `loading | error | success`. It runs on the client because the service uses relative URLs, because calling the app's own Route Handler from the server would require an absolute URL, and because this keeps the pages testable with Jest. That's why loading and error states are handled in the component rather than with `loading.tsx` / `error.tsx`.

**Format-agnostic component.** `FixedRange` takes an optional `formatValue`; the exercise 2 page passes `formatCurrency` (`Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" })`).

**Performance.** State isn't updated and `onChange` isn't called when the value doesn't change, and the currency formatter is created only once. `useMemo`/`useCallback` aren't used: the component tree is very small.

## Assumptions

- For exercise 2 the brief again asks for "a service returning minimum and maximum values" with the example `{ rangeValues: [] }`. This is interpreted as: the range minimum and maximum are the first and last items of the array.
- If the service returns fewer than two values, the page shows a message instead of the component.
- `rangeValues` is assumed to be sorted in ascending order.

## Testing

Jest + React Testing Library + user-event, configured with `next/jest`.

- **Unit:** pure functions (`utils/`), service with mocked `fetch`, and Route Handlers.
- **Hooks:** `useAsync` and `useRangeDrag`.
- **Components:** `EditableLabel` and `Range` in both modes (dragging, rounding, limits, no crossing, labels, currency format, snapping and keyboard).
- **Integration:** `Exercise1Range` and `Exercise2Range` with the service mocked (loading, data, error and empty list).

13 suites, 103 tests and ~98% line coverage.

Tests live next to the file they test. jsdom doesn't implement `PointerEvent`, `setPointerCapture` or layout, so `jest.setup.ts` adds a minimal polyfill and `test/pointer.ts` mocks the track measurements.

## Tooling

- ESLint 10 with flat config (`eslint.config.mjs`) and `eslint-config-next`.
- TypeScript 6: `typescript-eslint`, used by `eslint-config-next`, doesn't support TypeScript 7 yet.
- `jest.config.mjs` instead of `.ts`: the project is `"type": "module"` and a TypeScript config would require `ts-node`.

## Limitations and possible improvements

- The component is uncontrolled: if `min`/`max` change after mounting, the state isn't resynced. A controlled `value` prop could be added.
- `rangeValues` isn't validated or sorted, and a crossed `defaultValue` isn't checked.
- `onChange` fires on every move; an `onChangeEnd` would help with expensive requests.
- There's no retry button when loading fails.
- Accessible labels are hardcoded in Spanish; for i18n they should come in through props.
