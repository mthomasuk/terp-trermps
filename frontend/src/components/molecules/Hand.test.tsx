import { render, cleanup } from "@testing-library/react";

import Hand, { testIds } from "./Hand";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

describe("Hand", () => {
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
    leader: false,
    roundId: "12345",
    onPlayHand: jest.fn(),
    onSelectCard: jest.fn(),
    onSetDroppedCard: jest.fn(),
  };

  const fakeCard = {
    id: String(mockProps.cards.length),
    name: "Fake Card",
    type: "Dragon",
    strength: 10,
    skill: 10,
    magical_force: 10,
    weapons: 10,
    power: 10,
  };

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("renders default correctly", () => {
    const { getByTestId } = render(<Hand {...mockProps} />);

    const compRoot = getByTestId(testIds.ROOT);

    expect(compRoot).toBeDefined();
  });

  it("renders an in-play card if selectedCard prop is not null", () => {
    const { getByTestId, rerender } = render(<Hand {...mockProps} />);

    const compInPlay = getByTestId(testIds.IN_PLAY);

    expect(compInPlay.children).toHaveLength(0);

    rerender(<Hand {...mockProps} selectedCard={fakeCard} />);

    expect(compInPlay.children).toHaveLength(1);
  });

  it("renders a to-play card if droppedCard prop is not null", () => {
    const { getByTestId, rerender } = render(<Hand {...mockProps} />);

    const compToPlay = getByTestId(testIds.TO_PLAY);

    expect(compToPlay.children).toHaveLength(0);

    rerender(<Hand {...mockProps} droppedCard={fakeCard} />);

    expect(compToPlay.children).toHaveLength(1);
  });
});
