import { render, cleanup } from "@testing-library/react";

import Cards, { testIds } from "./Cards";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

describe("Cards", () => {
  const mockProps = {
    cards: [
      {
        id: "",
        name: "Fake Card",
        type: "Dragon",
        strength: 10,
        skill: 10,
        magical_force: 10,
        weapons: 10,
        power: 10,
      },
    ],
    roundId: "12345",
    onPlayHand: jest.fn(),
    leader: false,
  };

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("renders default correctly", () => {
    const { getByTestId } = render(<Cards {...mockProps} />);

    const compRoot = getByTestId(testIds.ROOT);

    expect(compRoot).toBeDefined();
  });
});
