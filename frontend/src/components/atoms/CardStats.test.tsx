import { render, cleanup } from "@testing-library/react";

import { ATTRIBUTES } from "../../constants";

import CardStats from "./CardStats";

describe("CardStats", () => {
  const mockCard = {
    id: "",
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

  it("renders default correctly", () => {
    render(<CardStats card={mockCard} />);

    const cardStatsClass = CardStats({ card: mockCard }).type.styledComponentId;
    const compRoot = document.getElementsByClassName(cardStatsClass);

    expect(compRoot[0]).toBeDefined();
  });

  it("renders the correct number of attribute rows", () => {
    render(<CardStats card={mockCard} />);

    const cardStatsClass = CardStats({ card: mockCard }).type.styledComponentId;
    const compRoot = document.getElementsByClassName(cardStatsClass);
    const statsRows = compRoot[0].children;

    expect(statsRows).toHaveLength(ATTRIBUTES.length);
  });
});
