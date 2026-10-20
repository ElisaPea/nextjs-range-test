import {
  clamp,
  findClosestIndex,
  getPointerPercent,
  indexToPercent,
  percentToIndex,
  percentToValue,
  roundToStep,
  valueToPercent,
} from "./range";

describe("clamp", () => {
  it("devuelve el valor si está dentro del intervalo", () => {
    expect(clamp(50, 1, 100)).toBe(50);
  });

  it("devuelve el mínimo si el valor es menor", () => {
    expect(clamp(-10, 1, 100)).toBe(1);
  });

  it("devuelve el máximo si el valor es mayor", () => {
    expect(clamp(150, 1, 100)).toBe(100);
  });

  it("acepta valores iguales a los límites", () => {
    expect(clamp(1, 1, 100)).toBe(1);
    expect(clamp(100, 1, 100)).toBe(100);
  });
});

describe("valueToPercent", () => {
  it("convierte los extremos en 0 y 100", () => {
    expect(valueToPercent(1, 1, 100)).toBe(0);
    expect(valueToPercent(100, 1, 100)).toBe(100);
  });

  it("convierte un valor intermedio en su porcentaje", () => {
    expect(valueToPercent(25, 0, 100)).toBe(25);
    expect(valueToPercent(50.5, 1, 100)).toBeCloseTo(50);
  });

  it("limita los valores fuera del intervalo", () => {
    expect(valueToPercent(-5, 0, 100)).toBe(0);
    expect(valueToPercent(500, 0, 100)).toBe(100);
  });

  it("devuelve 0 si min y max son iguales", () => {
    expect(valueToPercent(5, 5, 5)).toBe(0);
  });
});

describe("percentToValue", () => {
  it("convierte 0 y 100 en min y max", () => {
    expect(percentToValue(0, 1, 100)).toBe(1);
    expect(percentToValue(100, 1, 100)).toBe(100);
  });

  it("convierte un porcentaje intermedio en su valor", () => {
    expect(percentToValue(50, 0, 200)).toBe(100);
  });

  it("limita porcentajes fuera de 0-100", () => {
    expect(percentToValue(-20, 1, 100)).toBe(1);
    expect(percentToValue(120, 1, 100)).toBe(100);
  });

  it("es la inversa de valueToPercent", () => {
    const percent = valueToPercent(37, 1, 100);
    expect(percentToValue(percent, 1, 100)).toBeCloseTo(37);
  });
});

describe("roundToStep", () => {
  it("redondea al entero más cercano con paso 1", () => {
    expect(roundToStep(37.4, 1, 1)).toBe(37);
    expect(roundToStep(37.6, 1, 1)).toBe(38);
  });

  it("redondea al múltiplo del paso contando desde min", () => {
    expect(roundToStep(7, 5, 0)).toBe(5);
    expect(roundToStep(8, 5, 0)).toBe(10);
    expect(roundToStep(8, 5, 1)).toBe(6);
  });

  it("devuelve el valor sin cambios si el paso no es positivo", () => {
    expect(roundToStep(3.7, 0)).toBe(3.7);
    expect(roundToStep(3.7, -1)).toBe(3.7);
  });
});

describe("getPointerPercent", () => {
  const rect = { left: 100, width: 200 };

  it("calcula el porcentaje relativo al track", () => {
    expect(getPointerPercent(100, rect)).toBe(0);
    expect(getPointerPercent(150, rect)).toBe(25);
    expect(getPointerPercent(300, rect)).toBe(100);
  });

  it("limita a 0-100 si el puntero sale del track", () => {
    expect(getPointerPercent(0, rect)).toBe(0);
    expect(getPointerPercent(999, rect)).toBe(100);
  });

  it("devuelve 0 si el track no tiene ancho", () => {
    expect(getPointerPercent(150, { left: 0, width: 0 })).toBe(0);
  });
});

describe("findClosestIndex", () => {
  const values = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

  it("encuentra el índice de un valor exacto", () => {
    expect(findClosestIndex(values, 30.99)).toBe(3);
  });

  it("encuentra el índice del valor más cercano", () => {
    expect(findClosestIndex(values, 20)).toBe(2);
    expect(findClosestIndex(values, 45)).toBe(4);
  });

  it("devuelve los extremos para valores fuera de la lista", () => {
    expect(findClosestIndex(values, -100)).toBe(0);
    expect(findClosestIndex(values, 1000)).toBe(5);
  });

  it("en caso de empate se queda con el primero", () => {
    expect(findClosestIndex([0, 10], 5)).toBe(0);
  });

  it("devuelve -1 si la lista está vacía", () => {
    expect(findClosestIndex([], 5)).toBe(-1);
  });
});

describe("indexToPercent", () => {
  it("reparte los índices de forma equidistante", () => {
    expect(indexToPercent(0, 6)).toBe(0);
    expect(indexToPercent(1, 6)).toBe(20);
    expect(indexToPercent(5, 6)).toBe(100);
  });

  it("devuelve 0 si hay un elemento o ninguno", () => {
    expect(indexToPercent(0, 1)).toBe(0);
    expect(indexToPercent(0, 0)).toBe(0);
  });
});

describe("percentToIndex", () => {
  it("convierte el porcentaje en el índice más cercano", () => {
    expect(percentToIndex(0, 6)).toBe(0);
    expect(percentToIndex(45, 6)).toBe(2);
    expect(percentToIndex(50, 6)).toBe(3);
    expect(percentToIndex(100, 6)).toBe(5);
  });

  it("limita porcentajes fuera de 0-100", () => {
    expect(percentToIndex(-10, 6)).toBe(0);
    expect(percentToIndex(150, 6)).toBe(5);
  });

  it("es la inversa de indexToPercent", () => {
    for (let i = 0; i < 6; i++) {
      expect(percentToIndex(indexToPercent(i, 6), 6)).toBe(i);
    }
  });
});
