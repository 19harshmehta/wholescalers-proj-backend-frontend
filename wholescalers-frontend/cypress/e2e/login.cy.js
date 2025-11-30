describe("Public pages", () => {
  it("should open the home page", () => {
    cy.visit("http://127.0.0.1:8080/");
    cy.title().should("not.be.empty");
  });

  it("should open the login page", () => {
    cy.visit("http://127.0.0.1:8080/login");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
    cy.contains("Sign in to your account").should("exist");
  });

  it("should open the register page", () => {
    cy.visit("http://127.0.0.1:8080/register");
    cy.contains("Create your account").should("exist");
    cy.get("#name").should("exist");
    cy.get("#email").should("exist");
    cy.get("#password").should("exist");
  });
});
