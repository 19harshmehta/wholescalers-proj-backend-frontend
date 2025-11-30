// cypress/e2e/retailer_order.cy.js

describe("Retailer Orders", () => {

  beforeEach(() => {
    cy.loginAsRetailer();  // ends at /retailer/dashboard

    // 👇 navigate using the app, not a second visit()
    cy.contains("Orders").click();          // or use a better selector if you have
    cy.url().should("include", "/retailer/orders");
  });

  it("should load orders table", () => {
    cy.contains("My Orders").should("exist");
    cy.get("table").should("exist");
  });

  it("should show either orders or empty message", () => {
    cy.contains(/No orders found\. Start shopping!|Order ID/).should("exist");
  });

});
