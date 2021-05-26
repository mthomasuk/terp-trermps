import { render, cleanup } from "@testing-library/react";

import Cards, { testIds } from "./Cards";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

describe("Cards", () => {
  const mockProps = {
    cards: Array(5)
      .fill(0)
      .map((_, idx: number) => ({
        id: String(idx),
        name: "Fake Card",
        type: "Dragon",
        strength: 10,
        skill: 10,
        magical_force: 10,
        weapons: 10,
        power: 10,
      })),
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
    expect(compRoot.children).toHaveLength(1);
  });

  it("renders the correct number of cards based on props", () => {
    const { getByTestId } = render(<Cards {...mockProps} />);

    const compDeck = getByTestId(testIds.DECK);

    expect(compDeck).toBeDefined();
    expect(compDeck.children).toHaveLength(5);
  });

  it("handles not having any cards", () => {
    const { getByTestId } = render(<Cards {...mockProps} cards={[]} />);

    const compDeck = getByTestId(testIds.DECK);

    expect(compDeck).toBeDefined();
    expect(compDeck.children).toHaveLength(0);
  });

  it("renders the Deck component if leader prop is true", () => {
    const { getByTestId } = render(<Cards {...mockProps} leader={true} />);

    const compRoot = getByTestId(testIds.ROOT);
    const compHand = getByTestId(testIds.HAND);

    expect(compRoot.children).toHaveLength(2);
    expect(compHand).toBeDefined();
  });
});
