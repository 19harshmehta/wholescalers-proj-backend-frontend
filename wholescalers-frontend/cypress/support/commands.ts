/// <reference types="cypress" />

Cypress.Commands.add("loginAsRetailer", () => {
  cy.visit("/login");

  cy.get("#email").type("shahanuj981@gmail.com");
  cy.get("#password").type("123456");
  cy.contains("Sign In").click();

  cy.url().should("include", "/retailer/dashboard");
});
Cypress.Commands.add("loginAsWholesaler", () => {
  cy.visit("/login");

  cy.get("#email").type("archieshah2303@gmail.com");
  cy.get("#password").type("123456");
  cy.contains("Sign In").click();

  // adjust if your wholesaler lands on a different route
  cy.url().should("include", "/wholesaler/dashboard");
});



declare global {
  namespace Cypress {
    interface Chainable {
      loginAsRetailer(): Chainable<void>;
    }
  }
}

export {};
