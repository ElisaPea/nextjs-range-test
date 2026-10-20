import { fireEvent } from "@testing-library/react";

export function mockTrackRect(
  track: HTMLElement,
  { left = 0, width = 100 } = {},
) {
  jest.spyOn(track, "getBoundingClientRect").mockReturnValue({
    left,
    width,
    top: 0,
    right: left + width,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
    toJSON: () => ({}),
  });
}

export function drag(handle: HTMLElement, toClientX: number) {
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 0 });
  fireEvent.pointerMove(handle, { pointerId: 1, clientX: toClientX });
  fireEvent.pointerUp(handle, { pointerId: 1 });
}
