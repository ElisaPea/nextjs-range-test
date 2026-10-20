import { renderHook, waitFor } from "@testing-library/react";
import { useAsync } from "./useAsync";

it("devuelve los límites del rango", async () => {
  const asyncFn = () => Promise.resolve(42);
  const { result } = renderHook(() => useAsync(asyncFn));
  await waitFor(() =>
    expect(result.current).toEqual({ status: "success", data: 42 }),
  );
});
