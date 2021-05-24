import { render, cleanup } from "@testing-library/react";

import Message from "./Message";

import { BATTLE_START } from "../../constants";

describe("Message", () => {
  const mockMessage = {
    id: "123",
    body: "Fake Socket Message",
    type: "",
  };

  afterEach(() => {
    cleanup();
  });

  it("renders default correctly", () => {
    render(<Message message={mockMessage} />);

    const messageClass = Message({ message: mockMessage }).type
      .styledComponentId;
    const compRoot = document.getElementsByClassName(messageClass);

    expect(compRoot[0]).toBeDefined();
  });

  it("renders message body correctly", () => {
    render(<Message message={mockMessage} />);

    const messageClass = Message({ message: mockMessage }).type
      .styledComponentId;
    const compRoot = document.getElementsByClassName(messageClass);

    expect(compRoot[0].textContent).toMatch("Fake Socket Message");
  });

  it("renders battle started message correctly", () => {
    render(<Message message={{ ...mockMessage, type: BATTLE_START }} />);

    const messageClass = Message({ message: mockMessage }).type
      .styledComponentId;
    const compRoot = document.getElementsByClassName(messageClass);

    expect(compRoot[0].textContent).toMatch("Battle 123 has started!");
  });
});
