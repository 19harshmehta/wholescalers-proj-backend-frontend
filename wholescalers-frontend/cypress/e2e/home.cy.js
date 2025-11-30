// cypress/e2e/home.cy.js
describe("Home page navigation", () => {
  it("buttons should navigate correctly", () => {
    cy.visit("http://127.0.0.1:8080/");

    cy.contains("Start Free Trial").click();
    cy.url().should("include", "/register");

    cy.go("back");

    cy.contains("Sign In").click();
    cy.url().should("include", "/login");
  });
});
