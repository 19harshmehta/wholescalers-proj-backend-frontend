describe("Retailer Invoices", () => {
  beforeEach(() => {
    cy.loginAsRetailer(); // ends on dashboard

    // Use UI navigation instead of a second cy.visit()
    cy.contains("Invoices").click();  // or be more specific:
    // cy.contains("a", "Invoices").click();

    cy.url().should("include", "/retailer/invoices");
  });

  it("should load invoice table", () => {
    cy.contains("Invoices").should("exist");
    cy.get("table").should("exist");
  });

  it("should allow invoice download if available", () => {
    cy.contains("Download").first().click();
  });
});
