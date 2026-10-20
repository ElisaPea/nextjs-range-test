/**
 * @jest-environment node
 */
import { GET } from "./route";

it("devuelve los límites del rango", async () => {
  const response = GET();
  expect(response.status).toBe(200);
  await expect(response.json()).resolves.toEqual({ min: 1, max: 100 });
});
