describe("Protected routes", () => {
  it("unauthenticated user is redirected from wholesaler dashboard", () => {
    cy.clearLocalStorage(); // or clear auth storage used in AuthContext
    cy.visit("http://127.0.0.1:8080/wholesaler/dashboard");
    cy.url().should("include", "/login");
  });
});
