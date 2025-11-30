describe("Wholesaler Dashboard", () => {
  beforeEach(() => {
    cy.loginAsWholesaler(); // already ends on /wholesaler/dashboard
  });

  it("shows dashboard heading", () => {
    cy.contains("Dashboard Overview").should("exist");
    cy.contains("Welcome back! Here's your business summary.").should("exist");
  });

  it("renders key metric cards", () => {
    cy.contains("Total Revenue").should("exist");
    cy.contains("Total Orders").should("exist");
    cy.contains("Pending Orders").should("exist");
    cy.contains("Total Customers").should("exist");
  });

  it("shows low stock section or empty state", () => {
    cy.contains("Low Stock Products").should("exist");

    cy.get("body").then(($body) => {
      const text = $body.text();
      if (text.includes("All products are well stocked")) {
        cy.contains("All products are well stocked").should("exist");
      } else {
        cy.contains("left").should("exist"); // "X left" badge
      }
    });
  });
});
