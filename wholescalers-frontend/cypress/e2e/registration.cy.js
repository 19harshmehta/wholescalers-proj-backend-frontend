describe("Protected routes", () => {
  beforeEach(() => {
    cy.clearLocalStorage(); // or whatever your AuthContext uses
  });

  it("redirects unauthenticated retailer dashboard access to login", () => {
    cy.visit("http://127.0.0.1:8080/retailer/dashboard");
    cy.url().should("include", "/login");
  });

  it("redirects unauthenticated wholesaler dashboard access to login", () => {
    cy.visit("http://127.0.0.1:8080/wholesaler/dashboard");
    cy.url().should("include", "/login");
  });
});
