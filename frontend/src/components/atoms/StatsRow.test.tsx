import { render, cleanup } from "@testing-library/react";

import { getTestStyles, rgbToHex } from "../utils/__helpers__";

import StatsRow from "./StatsRow";

describe("StatsRow", () => {
  const mockProps = {
    attribute: {
      key: "strength",
      value: 100,
    },
    selected: false,
    isAttribute: false,
    onSelectAttribute: () => {},
  };

  afterEach(() => {
    cleanup();
  });

  it("renders default correctly", () => {
    render(<StatsRow {...mockProps} />);

    const statsRowClass = StatsRow(mockProps).type.styledComponentId;
    const compRoot = document.getElementsByClassName(statsRowClass);

    expect(compRoot[0]).toBeDefined();

    expect(compRoot[0].textContent).toMatch("Strength");
  });

  it("renders different styles if isAttribute is true", () => {
    const selectedProps = {
      ...mockProps,
      isAttribute: true,
    };

    render(<StatsRow {...selectedProps} />);

    const style = getTestStyles(StatsRow, selectedProps);

    expect(rgbToHex(style.backgroundColor)).toMatch("#efefef");
    expect(rgbToHex(style.color)).toMatch("#e65252");
  });
});
