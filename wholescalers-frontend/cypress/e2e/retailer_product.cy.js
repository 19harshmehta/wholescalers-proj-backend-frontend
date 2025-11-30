// cypress/e2e/retailer_products.cy.js

describe("Retailer Products", () => {
  beforeEach(() => {
    cy.loginAsRetailer(); // ends on /retailer/dashboard

    // ✅ Use sidebar/navbar link instead of cy.visit
    cy.get('a[href="/retailer/products"]').click();

    cy.url().should("include", "/retailer/products");
  });

  it("should display products heading", () => {
    cy.contains("Browse Products").should("be.visible");
  });

  it("should open order dialog and place order with quantity > MOQ", () => {
    // Work with the first product card
    cy.get(".shadow-md").first().then(($card) => {
      // Find the MOQ row inside this card
      const $moqLabel = Cypress.$($card)
        .find("span")
        .filter((_, el) => el.textContent.trim() === "MOQ:")
        .first();

      const moqText = $moqLabel
        .parent()
        .find("span")
        .eq(1)
        .text()
        .trim();

      const moq = Number(moqText) || 1;
      const qtyToOrder = moq + 1; // ✅ strictly greater than MOQ

      cy.log(`Detected MOQ = ${moq}, ordering = ${qtyToOrder}`);

      // Intercept order API
      cy.intercept("POST", "**/api/orders").as("createOrder");

      // Click "Place Order" button for this same card
      cy.wrap($card).contains("Place Order").click();

      // Fill quantity in dialog
      cy.get("#quantity")
        .clear()
        .type(String(qtyToOrder));

      // Confirm order
      cy.contains("Confirm Order").click();

      // ✅ Assert the order API actually succeeded
      cy.wait("@createOrder")
        .its("response.statusCode")
        .should("eq", 201);

      // ✅ Optional: dialog closed = no quantity input
      cy.get("#quantity").should("not.exist");


    });
  });
});
