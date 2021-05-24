import { render, cleanup } from "@testing-library/react";

import BattleStatus from "./BattleStatus";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

jest.mock("../context/Websocket", () => ({
  useSocket: () => ({ attributeSelected: "" }),
}));

describe("BattleStatus", () => {
  const mockProps = {
    isLeader: false,
    battleInProgress: false,
  };

  afterEach(() => {
    cleanup();
  });

  it("renders default correctly", () => {
    render(<BattleStatus {...mockProps} />);

    const battleStatusClass = BattleStatus(mockProps).type.styledComponentId;
    const compRoot = document.getElementsByClassName(battleStatusClass);

    expect(compRoot[0]).toBeDefined();

    expect(compRoot[0].textContent).toMatch("Waiting for the battle to start");
  });

  it("renders different styles if battleInProgress is true", () => {
    const leaderProps = {
      ...mockProps,
      battleInProgress: true,
    };

    render(<BattleStatus {...leaderProps} />);

    const battleStatusClass = BattleStatus(leaderProps).type.styledComponentId;
    const compRoot = document.getElementsByClassName(battleStatusClass);

    expect(compRoot[0]).toBeDefined();

    expect(compRoot[0].textContent).toMatch(
      "Your enemy is plotting something..."
    );
  });

  it("renders different styles if isLeader is true", () => {
    const leaderProps = {
      ...mockProps,
      battleInProgress: true,
      isLeader: true,
    };

    render(<BattleStatus {...leaderProps} />);

    const battleStatusClass = BattleStatus(leaderProps).type.styledComponentId;
    const compRoot = document.getElementsByClassName(battleStatusClass);

    expect(compRoot[0]).toBeDefined();

    expect(compRoot[0].textContent).toMatch("Choose your card & attribute!");
  });

  it("renders different styles if selectedAttr is populated", () => {
    const leaderProps = {
      ...mockProps,
      selectedAttr: "strength",
    };

    render(<BattleStatus {...leaderProps} />);

    const battleStatusClass = BattleStatus(leaderProps).type.styledComponentId;
    const compRoot = document.getElementsByClassName(battleStatusClass);

    expect(compRoot[0]).toBeDefined();

    expect(compRoot[0].textContent).toMatch("Attribute is strength!");
  });
});
