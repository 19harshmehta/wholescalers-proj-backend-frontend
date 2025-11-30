describe("Retailer Dashboard", () => {

  beforeEach(() => {
    cy.loginAsRetailer(); // ✅ custom command (I’ll show below)
  });

  it("should load retailer dashboard stats", () => {
    cy.visit("/retailer/dashboard");

    cy.contains("Dashboard Overview").should("exist");
    cy.contains("Total Orders").should("exist");
    cy.contains("Total Spent").should("exist");
    cy.contains("Pending Payments").should("exist");
  });

});
