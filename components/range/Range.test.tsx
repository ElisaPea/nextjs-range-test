import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { drag, mockTrackRect } from "@/test/pointer";
import { formatCurrency } from "@/utils/format";
import { Range } from "./Range";

const FIXED_VALUES = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

/** Devuelve los dos handles y simula un track de 100px (1px = 1%) */
function getHandles() {
  const [minHandle, maxHandle] = screen.getAllByRole("slider");
  mockTrackRect(minHandle.parentElement as HTMLElement, {
    left: 0,
    width: 100,
  });
  return { minHandle, maxHandle };
}

async function editLabel(name: RegExp, text: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name }));
  const input = screen.getByRole("spinbutton");
  await user.clear(input);
  await user.type(input, `${text}{Enter}`);
}

describe("Range · modo continuo", () => {
  function setup(
    props: Partial<{ defaultValue: { min: number; max: number } }> = {},
  ) {
    const onChange = jest.fn();
    render(
      <Range
        mode="continuous"
        min={1}
        max={100}
        label="Precio"
        onChange={onChange}
        {...props}
      />,
    );
    return { onChange, ...getHandles() };
  }

  it("renderiza un grupo con dos sliders accesibles", () => {
    setup();

    const group = screen.getByRole("group", { name: "Precio" });
    expect(within(group).getAllByRole("slider")).toHaveLength(2);
  });

  it("no usa un input range nativo", () => {
    const { container } = render(<Range mode="continuous" min={1} max={100} />);

    expect(container.querySelector('input[type="range"]')).toBeNull();
  });

  it("empieza en los límites si no hay defaultValue", () => {
    const { minHandle, maxHandle } = setup();

    expect(minHandle).toHaveAttribute("aria-valuenow", "1");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
  });

  it("respeta el defaultValue y lo limita a min-max", () => {
    const { minHandle, maxHandle } = setup({
      defaultValue: { min: -50, max: 40 },
    });

    expect(minHandle).toHaveAttribute("aria-valuenow", "1");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "40");
  });

  it("los atributos aria reflejan que los handles no se pueden cruzar", () => {
    const { minHandle, maxHandle } = setup({
      defaultValue: { min: 20, max: 80 },
    });

    expect(minHandle).toHaveAttribute("aria-valuemin", "1");
    expect(minHandle).toHaveAttribute("aria-valuemax", "80");
    expect(maxHandle).toHaveAttribute("aria-valuemin", "20");
    expect(maxHandle).toHaveAttribute("aria-valuemax", "100");
  });

  it("coloca los handles según su valor", () => {
    const { maxHandle } = setup({ defaultValue: { min: 1, max: 50.5 } });

    expect(maxHandle.style.left).toBe("50%");
  });

  describe("arrastre", () => {
    it("mueve el handle mínimo y redondea al paso", () => {
      const { minHandle, onChange } = setup();

      drag(minHandle, 30.4);

      expect(minHandle).toHaveAttribute("aria-valuenow", "31");
      expect(onChange).toHaveBeenLastCalledWith({ min: 31, max: 100 });
    });

    it("actualiza las etiquetas al arrastrar", () => {
      const { maxHandle } = setup();

      drag(maxHandle, 50);

      expect(
        screen.getByRole("button", { name: /valor máximo/i }),
      ).toHaveTextContent("51");
    });

    it("el mínimo no puede superar al máximo (queda un paso por debajo)", () => {
      const { minHandle, onChange } = setup({
        defaultValue: { min: 20, max: 60 },
      });

      drag(minHandle, 90);

      expect(minHandle).toHaveAttribute("aria-valuenow", "59");
      expect(onChange).toHaveBeenLastCalledWith({ min: 59, max: 60 });
    });

    it("el máximo no puede bajar del mínimo (queda un paso por encima)", () => {
      const { maxHandle } = setup({ defaultValue: { min: 40, max: 80 } });

      drag(maxHandle, 0);

      expect(maxHandle).toHaveAttribute("aria-valuenow", "41");
    });

    it("no sale de los límites aunque el puntero salga del track", () => {
      const { minHandle, maxHandle } = setup({
        defaultValue: { min: 20, max: 80 },
      });

      drag(minHandle, -500);
      drag(maxHandle, 500);

      expect(minHandle).toHaveAttribute("aria-valuenow", "1");
      expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
    });

    it("no llama a onChange si el valor no cambia", () => {
      const { maxHandle, onChange } = setup();

      drag(maxHandle, 100);

      expect(onChange).not.toHaveBeenCalled();
    });

    it("marca el handle como dragging solo mientras se arrastra", () => {
      const { minHandle } = setup();

      fireEvent.pointerDown(minHandle, { button: 0, pointerId: 1 });
      expect(minHandle).toHaveClass("dragging");

      fireEvent.pointerUp(minHandle, { pointerId: 1 });
      expect(minHandle).not.toHaveClass("dragging");
    });
  });

  describe("etiquetas editables", () => {
    it("muestra los valores como botones editables", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /valor mínimo: 1/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /valor máximo: 100/i }),
      ).toBeInTheDocument();
    });

    it("al escribir un valor se mueve el handle", async () => {
      const { minHandle, onChange } = setup();

      await editLabel(/valor mínimo/i, "25");

      expect(minHandle).toHaveAttribute("aria-valuenow", "25");
      expect(onChange).toHaveBeenLastCalledWith({ min: 25, max: 100 });
    });

    it("limita el valor escrito al máximo permitido", async () => {
      const { maxHandle } = setup();

      await editLabel(/valor máximo/i, "500");

      expect(maxHandle).toHaveAttribute("aria-valuenow", "100");
    });

    it("limita el valor escrito al mínimo permitido", async () => {
      const { minHandle } = setup({ defaultValue: { min: 20, max: 80 } });

      await editLabel(/valor mínimo/i, "-10");

      expect(minHandle).toHaveAttribute("aria-valuenow", "1");
    });

    it("no permite cruzar los valores al escribir", async () => {
      const { minHandle } = setup({ defaultValue: { min: 20, max: 80 } });

      await editLabel(/valor mínimo/i, "95");

      expect(minHandle).toHaveAttribute("aria-valuenow", "79");
    });

    it("redondea el valor escrito al paso", async () => {
      const { maxHandle } = setup();

      await editLabel(/valor máximo/i, "37.6");

      expect(maxHandle).toHaveAttribute("aria-valuenow", "38");
    });
  });
});
describe("Range · modo valores fijos", () => {
  function setup(values = FIXED_VALUES) {
    const onChange = jest.fn();
    render(
      <Range
        mode="fixed"
        values={values}
        formatValue={formatCurrency}
        label="Precio"
        onChange={onChange}
      />,
    );
    return { onChange, ...getHandles() };
  }

  it("empieza en el primer y el último valor", () => {
    const { minHandle, maxHandle } = setup();

    expect(minHandle).toHaveAttribute("aria-valuenow", "1.99");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "70.99");
  });

  it("coloca el defaultValue en el valor de la lista más cercano", () => {
    render(
      <Range
        mode="fixed"
        values={FIXED_VALUES}
        defaultValue={{ min: 6, max: 49 }}
      />,
    );
    const [minHandle, maxHandle] = screen.getAllByRole("slider");

    expect(minHandle).toHaveAttribute("aria-valuenow", "5.99");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "50.99");
  });

  it("muestra las etiquetas formateadas como moneda", () => {
    setup();

    expect(screen.getByText(/^1,99\s€$/)).toBeInTheDocument();
    expect(screen.getByText(/^70,99\s€$/)).toBeInTheDocument();
  });

  it("las etiquetas no son editables", () => {
    setup();

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("anuncia el valor formateado a los lectores de pantalla", () => {
    const { minHandle } = setup();

    expect(minHandle).toHaveAttribute("aria-valuetext", formatCurrency(1.99));
  });

  it("reparte los valores de forma equidistante en el track", () => {
    const { minHandle } = setup();

    drag(minHandle, 40);

    expect(minHandle.style.left).toBe("40%");
  });

  describe("arrastre", () => {
    it("salta al valor más cercano", () => {
      const { minHandle, onChange } = setup();

      drag(minHandle, 45);

      expect(minHandle).toHaveAttribute("aria-valuenow", "10.99");
      expect(onChange).toHaveBeenLastCalledWith({ min: 10.99, max: 70.99 });
    });

    it("solo permite valores de la lista", () => {
      const { maxHandle } = setup();

      for (const position of [95, 73, 55, 33]) {
        drag(maxHandle, position);
        const value = Number(maxHandle.getAttribute("aria-valuenow"));
        expect(FIXED_VALUES).toContain(value);
      }
    });

    it("el mínimo no puede alcanzar al máximo", () => {
      const { minHandle, maxHandle } = setup();

      drag(maxHandle, 60);
      drag(minHandle, 100);

      expect(maxHandle).toHaveAttribute("aria-valuenow", "30.99");
      expect(minHandle).toHaveAttribute("aria-valuenow", "10.99");
    });

    it("el máximo no puede alcanzar al mínimo", () => {
      const { minHandle, maxHandle } = setup();

      drag(minHandle, 80);
      drag(maxHandle, 0);

      expect(minHandle).toHaveAttribute("aria-valuenow", "50.99");
      expect(maxHandle).toHaveAttribute("aria-valuenow", "70.99");
    });

    it("actualiza las etiquetas al arrastrar", () => {
      const { maxHandle } = setup();

      drag(maxHandle, 20);

      expect(screen.getByText(/^5,99\s€$/)).toBeInTheDocument();
    });
  });

  it("no renderiza nada si hay menos de dos valores", () => {
    const { container } = render(<Range mode="fixed" values={[1.99]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
