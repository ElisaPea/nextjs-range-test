import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getRangeLimits } from "@/services/rangeService";
import { Exercise1Range } from "./Exercise1Range";

jest.mock("@/services/rangeService");

const mockGetRangeLimits = jest.mocked(getRangeLimits);

describe("Exercise1Range", () => {
  it("muestra un estado de carga mientras llegan los datos", () => {
    mockGetRangeLimits.mockReturnValue(new Promise(() => {}));
    render(<Exercise1Range />);

    expect(screen.getByRole("status")).toHaveTextContent(/cargando/i);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("pinta el rango con los límites del servicio", async () => {
    mockGetRangeLimits.mockResolvedValue({ min: 10, max: 200 });
    render(<Exercise1Range />);

    const [minHandle, maxHandle] = await screen.findAllByRole("slider");
    expect(minHandle).toHaveAttribute("aria-valuenow", "10");
    expect(maxHandle).toHaveAttribute("aria-valuenow", "200");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("muestra un error si el servicio falla", async () => {
    mockGetRangeLimits.mockRejectedValue(new Error("500"));
    render(<Exercise1Range />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /no se ha podido cargar/i,
    );
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("las etiquetas son editables y respetan los límites del servicio", async () => {
    mockGetRangeLimits.mockResolvedValue({ min: 1, max: 100 });
    render(<Exercise1Range />);
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole("button", { name: /valor máximo/i }),
    );
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "150{Enter}");

    expect(screen.getAllByRole("slider")[1]).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });
});
