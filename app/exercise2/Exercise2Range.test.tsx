import { render, screen } from "@testing-library/react";
import { getFixedRangeValues } from "@/services/rangeService";
import { Exercise2Range } from "./Exercise2Range";

jest.mock("@/services/rangeService");

const mockGetFixedRangeValues = jest.mocked(getFixedRangeValues);
const RANGE_VALUES = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

describe("Exercise2Range", () => {
  it("muestra un estado de carga mientras llegan los datos", () => {
    mockGetFixedRangeValues.mockReturnValue(new Promise(() => {}));
    render(<Exercise2Range />);

    expect(screen.getByRole("status")).toHaveTextContent(/cargando/i);
  });

  it("pinta el rango con el primer y el último valor del servicio", async () => {
    mockGetFixedRangeValues.mockResolvedValue({ rangeValues: RANGE_VALUES });
    render(<Exercise2Range />);

    const [minHandle, maxHandle] = await screen.findAllByRole("slider");
    expect(minHandle).toHaveAttribute("aria-valuenow", "1.99");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "70.99");
  });

  it("muestra las etiquetas como moneda y no editables", async () => {
    mockGetFixedRangeValues.mockResolvedValue({ rangeValues: RANGE_VALUES });
    render(<Exercise2Range />);

    expect(await screen.findByText(/^1,99\s€$/)).toBeInTheDocument();
    expect(screen.getByText(/^70,99\s€$/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("muestra un error si el servicio falla", async () => {
    mockGetFixedRangeValues.mockRejectedValue(new Error("500"));
    render(<Exercise2Range />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /no se han podido cargar/i,
    );
  });

  it("avisa si el servicio devuelve menos de dos valores", async () => {
    mockGetFixedRangeValues.mockResolvedValue({ rangeValues: [] });
    render(<Exercise2Range />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /no hay suficientes valores/i,
    );
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });
});
