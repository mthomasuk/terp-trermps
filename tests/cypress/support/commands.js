import "@testing-library/cypress/add-commands";

const user = require("../fixtures/profile");

Cypress.Commands.add("signIn", () => {
  cy.visit("http://localhost:3000/");
  cy.findByTestId("login-nameInput").type(user.name);
  cy.findByTestId("login-passwordInput").type(user.password);
  cy.get("button[type=submit]").click();
});
