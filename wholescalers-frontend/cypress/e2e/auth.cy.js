// cypress/e2e/auth.cy.js
describe("Authentication", () => {

  it("should login successfully as retailer", () => {
    cy.visit("http://127.0.0.1:8080/login");

    cy.get("#email").type("shahanuj981@gmail.com");
    cy.get("#password").type("123456");
    cy.contains("Sign In").click();

    // Redirect based on actual role
    cy.url().should("include", "/retailer/dashboard");
  });

 // cypress/e2e/auth.cy.js
describe("Authentication", () => {

  it("should login successfully as retailer", () => {
    cy.visit("http://127.0.0.1:8080/login");

    cy.get("#email").type("shahanuj981@gmail.com");
    cy.get("#password").type("123456");
    cy.contains("Sign In").click();

    // Redirect based on actual role
    cy.url().should("include", "/retailer/dashboard");
  });

  it("should show error on invalid login", () => {
    cy.visit("http://127.0.0.1:8080/login");

    cy.get("#email").type("wholesale@test.com");
    cy.get("#password").type("wrongpass");
    cy.contains("Sign In").click();

    cy.contains(/invalid|failed|error/i).should("exist");

    cy.url().should("include", "/login");
  });

});


});
