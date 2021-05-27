import { within } from "@testing-library/dom";

describe("Sign in & out", () => {
  it("should sign in a user successfully", () => {
    cy.signIn();
    expect(cy.location("pathname").should("not.include", "login"));
  });
});
