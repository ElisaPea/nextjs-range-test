import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Range } from "./Range";

describe("Range · teclado", () => {
  it("las flechas mueven el handle con foco un paso", async () => {
    render(
      <Range
        mode="continuous"
        min={1}
        max={100}
        defaultValue={{ min: 20, max: 80 }}
      />,
    );
    const [minHandle] = screen.getAllByRole("slider");
    const user = userEvent.setup();

    minHandle.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(minHandle).toHaveAttribute("aria-valuenow", "22");

    await user.keyboard("{ArrowLeft}");
    expect(minHandle).toHaveAttribute("aria-valuenow", "21");
  });

  it("Home y End llevan al límite permitido sin cruzar", async () => {
    render(
      <Range
        mode="continuous"
        min={1}
        max={100}
        defaultValue={{ min: 20, max: 80 }}
      />,
    );
    const [minHandle] = screen.getAllByRole("slider");
    const user = userEvent.setup();

    minHandle.focus();
    await user.keyboard("{Home}");
    expect(minHandle).toHaveAttribute("aria-valuenow", "1");

    await user.keyboard("{End}");
    expect(minHandle).toHaveAttribute("aria-valuenow", "79");
  });

  it("en el modo fijo las flechas saltan al siguiente valor de la lista", async () => {
    render(
      <Range mode="fixed" values={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]} />,
    );
    const [minHandle] = screen.getAllByRole("slider");
    const user = userEvent.setup();

    minHandle.focus();
    await user.keyboard("{ArrowRight}");
    expect(minHandle).toHaveAttribute("aria-valuenow", "5.99");
  });
});
