import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditableLabel } from "./EditableLabel";

function setup(value = 20) {
  const onCommit = jest.fn();
  render(
    <EditableLabel
      value={value}
      ariaLabel="Valor mínimo"
      onCommit={onCommit}
    />,
  );
  return { onCommit, user: userEvent.setup() };
}

describe("EditableLabel", () => {
  it("muestra el valor como un botón", () => {
    setup();

    expect(
      screen.getByRole("button", { name: /valor mínimo: 20/i }),
    ).toHaveTextContent("20");
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("al hacer clic se convierte en un input enfocado con el valor", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button"));

    const input = screen.getByRole("spinbutton", { name: "Valor mínimo" });
    expect(input).toHaveValue(20);
    expect(input).toHaveFocus();
  });

  it("confirma el nuevo valor con Enter", async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole("button"));
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "45{Enter}");

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(45);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("confirma el nuevo valor al perder el foco", async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole("button"));
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "30");
    await user.tab();

    expect(onCommit).toHaveBeenCalledWith(30);
  });

  it("cancela la edición con Escape", async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole("button"));
    await user.clear(screen.getByRole("spinbutton"));
    await user.type(screen.getByRole("spinbutton"), "99{Escape}");

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveTextContent("20");
  });

  it("no confirma nada si el input se deja vacío", async () => {
    const { user, onCommit } = setup();

    await user.click(screen.getByRole("button"));
    await user.clear(screen.getByRole("spinbutton"));
    await user.keyboard("{Enter}");

    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveTextContent("20");
  });

  it("se puede editar solo con el teclado", async () => {
    const { user, onCommit } = setup();

    await user.tab();
    await user.keyboard("{Enter}");
    await user.keyboard("{Control>}a{/Control}60{Enter}");

    expect(onCommit).toHaveBeenCalledWith(60);
  });
});
