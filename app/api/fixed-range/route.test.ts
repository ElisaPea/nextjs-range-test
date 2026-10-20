/**
 * @jest-environment node
 */
import { GET } from "./route";

describe("GET /api/fixed-range", () => {
  it("devuelve los valores fijos del rango", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99],
    });
  });
});
