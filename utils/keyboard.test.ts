import { getKeyAction, PAGE_STEPS } from "./keyboard";

describe("getKeyAction", () => {
  it.each([
    ["ArrowRight", 1],
    ["ArrowUp", 1],
    ["ArrowLeft", -1],
    ["ArrowDown", -1],
    ["PageUp", PAGE_STEPS],
    ["PageDown", -PAGE_STEPS],
  ])("%s avanza %i pasos", (key, steps) => {
    expect(getKeyAction(key)).toEqual({ type: "step", steps });
  });

  it("Home va al inicio y End al final", () => {
    expect(getKeyAction("Home")).toEqual({ type: "edge", edge: "start" });
    expect(getKeyAction("End")).toEqual({ type: "edge", edge: "end" });
  });

  it("devuelve null para teclas que no controlan el slider", () => {
    expect(getKeyAction("a")).toBeNull();
    expect(getKeyAction("Tab")).toBeNull();
  });
});
