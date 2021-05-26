import { render, cleanup } from "@testing-library/react";

import BattleStatus, { testIds } from "./BattleStatus";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

describe("BattleStatus", () => {
  const mockProps = {
    isLeader: false,
    battleInProgress: false,
  };

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("renders default correctly", () => {
    const { getByTestId, getByText } = render(<BattleStatus {...mockProps} />);

    const compRoot = getByTestId(testIds.ROOT);
    const content = getByText("Waiting for the battle to start");

    expect(compRoot).toBeDefined();
    expect(content).toBeDefined();
  });

  it("renders different text if battleInProgress is true", () => {
    const progressProps = {
      ...mockProps,
      battleInProgress: true,
    };

    const { getByText } = render(<BattleStatus {...progressProps} />);

    const content = getByText("Your enemy is plotting something...");

    expect(content).toBeDefined();
  });

  it("renders different text if isLeader is true", () => {
    const leaderProps = {
      ...mockProps,
      battleInProgress: true,
      isLeader: true,
    };

    const { getByText } = render(<BattleStatus {...leaderProps} />);

    const content = getByText("Choose your card & attribute!");

    expect(content).toBeDefined();
  });

  it("renders different text if selectedAttr is populated", () => {
    const attrProps = {
      ...mockProps,
      battleInProgress: true,
      isLeader: true,
      selectedAttr: "strength",
    };

    const { getByText } = render(<BattleStatus {...attrProps} />);

    const content = getByText("Attribute is strength!");

    expect(content).toBeDefined();
  });
});
