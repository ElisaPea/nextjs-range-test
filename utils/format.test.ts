import { formatCurrency } from "./format";

describe("formatCurrency", () => {
  it("formatea en euros con coma decimal", () => {
    expect(formatCurrency(1.99)).toBe("1,99\u00a0€");
  });

  it("muestra siempre dos decimales", () => {
    expect(formatCurrency(5)).toBe("5,00\u00a0€");
  });

  it("redondea a dos decimales", () => {
    expect(formatCurrency(10.999)).toBe("11,00\u00a0€");
  });
});
