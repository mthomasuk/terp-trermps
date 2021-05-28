describe("Sign in", () => {
  it("should sign in a user successfully", () => {
    cy.signIn();

    expect(cy.location("pathname").should("not.include", "login"));

    cy.getCookies()
      .should("have.length", 1)
      .then((cookies) => {
        expect(cookies[0]).to.have.property("name", "session");
      });
  });
});
