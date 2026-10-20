export type KeyAction =
  | { type: "step"; steps: number }
  | { type: "edge"; edge: "start" | "end" };

export const PAGE_STEPS = 10;

const KEY_ACTIONS: Record<string, KeyAction> = {
  ArrowRight: { type: "step", steps: 1 },
  ArrowUp: { type: "step", steps: 1 },
  ArrowLeft: { type: "step", steps: -1 },
  ArrowDown: { type: "step", steps: -1 },
  PageUp: { type: "step", steps: PAGE_STEPS },
  PageDown: { type: "step", steps: -PAGE_STEPS },
  Home: { type: "edge", edge: "start" },
  End: { type: "edge", edge: "end" },
};

export function getKeyAction(key: string): KeyAction | null {
  return KEY_ACTIONS[key] ?? null;
}
