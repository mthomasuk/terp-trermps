import { render, cleanup } from "@testing-library/react";

import { getTestStyles } from "../utils/__helpers__";

import CardImage from "./CardImage";

describe("CardImage", () => {
  const mockName = "test-name";

  afterEach(() => {
    cleanup();
  });

  it("renders default correctly", () => {
    render(<CardImage name={mockName} />);

    const cardImageClass = CardImage({ name: mockName }).type.styledComponentId;
    const compRoot = document.getElementsByClassName(cardImageClass);

    expect(compRoot[0]).toBeDefined();
  });

  it("passes no background image if no match is found in the image-map for the name provided", () => {
    render(<CardImage name={""} />);
    const style = getTestStyles(CardImage, { name: "" });

    expect(style.background).toMatch("");
  });
});
