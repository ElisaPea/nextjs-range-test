import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { mockTrackRect } from "@/test/pointer";
import { useRangeDrag, type HandleId } from "./useRangeDrag";

function TestTrack({
  onDrag,
}: {
  onDrag: (handle: HandleId, percent: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeHandle, getHandleProps } = useRangeDrag({ trackRef, onDrag });

  return (
    <div ref={trackRef} data-testid="track">
      <div data-testid="min" {...getHandleProps("min")} />
      <div data-testid="max" {...getHandleProps("max")} />
      <span data-testid="active">{activeHandle ?? "none"}</span>
    </div>
  );
}

function setup() {
  const onDrag = jest.fn();
  render(<TestTrack onDrag={onDrag} />);
  mockTrackRect(screen.getByTestId("track"), { left: 100, width: 200 });
  return {
    onDrag,
    min: screen.getByTestId("min"),
    max: screen.getByTestId("max"),
  };
}

describe("useRangeDrag", () => {
  it("notifica el porcentaje del puntero mientras se arrastra", () => {
    const { onDrag, min } = setup();

    fireEvent.pointerDown(min, { button: 0, pointerId: 1 });
    fireEvent.pointerMove(min, { pointerId: 1, clientX: 150 });

    expect(onDrag).toHaveBeenCalledWith("min", 25);
  });

  it("limita el porcentaje a 0-100 si el puntero sale del track", () => {
    const { onDrag, max } = setup();

    fireEvent.pointerDown(max, { button: 0, pointerId: 1 });
    fireEvent.pointerMove(max, { pointerId: 1, clientX: 999 });

    expect(onDrag).toHaveBeenCalledWith("max", 100);
  });

  it("no notifica nada si solo se pasa el puntero por encima", () => {
    const { onDrag, min } = setup();

    fireEvent.pointerMove(min, { pointerId: 1, clientX: 150 });

    expect(onDrag).not.toHaveBeenCalled();
  });

  it("ignora botones que no sean el principal", () => {
    const { onDrag, min } = setup();

    fireEvent.pointerDown(min, { button: 2, pointerId: 1 });
    fireEvent.pointerMove(min, { pointerId: 1, clientX: 150 });

    expect(onDrag).not.toHaveBeenCalled();
  });

  it("expone el handle activo y lo limpia al soltar", () => {
    const { min } = setup();
    const active = screen.getByTestId("active");

    fireEvent.pointerDown(min, { button: 0, pointerId: 1 });
    expect(active).toHaveTextContent("min");

    fireEvent.pointerUp(min, { pointerId: 1 });
    expect(active).toHaveTextContent("none");
  });

  it("termina el arrastre si el sistema cancela el puntero", () => {
    const { onDrag, min } = setup();

    fireEvent.pointerDown(min, { button: 0, pointerId: 1 });
    fireEvent.pointerCancel(min, { pointerId: 1 });
    fireEvent.pointerMove(min, { pointerId: 1, clientX: 150 });

    expect(onDrag).not.toHaveBeenCalled();
  });
});
