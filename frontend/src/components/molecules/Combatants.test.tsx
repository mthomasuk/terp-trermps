import { render, cleanup } from "@testing-library/react";

import Combatants, { testIds } from "./Combatants";
describe("Combatants", () => {
  const mockProps = {
    combatants: Array(3)
      .fill(0)
      .map((_, idx: number) => ({
        user_id: String(idx),
        name: "Fake Combatant",
      })),
  };

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("renders default correctly", () => {
    const { getByTestId } = render(<Combatants {...mockProps} />);

    const compRoot = getByTestId(testIds.ROOT);

    expect(compRoot).toBeDefined();
  });

  it("renders the correct number of combatants based on props", () => {
    const { getByTestId } = render(<Combatants {...mockProps} />);

    const compRoot = getByTestId(testIds.ROOT);

    expect(compRoot).toBeDefined();
    expect(compRoot.children).toHaveLength(3);
  });
});
