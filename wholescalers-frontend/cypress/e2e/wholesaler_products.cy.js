describe("Wholesaler Products", () => {
  beforeEach(() => {
    // logs in and lands on /wholesaler/dashboard
    cy.loginAsWholesaler();

    // navigate via app UI
    cy.contains("Products").click();
    cy.location("pathname").should("include", "/wholesaler/products");
  });

  it("renders products heading and description", () => {
    cy.contains("Products").should("exist");
    cy.contains("Manage your product catalog").should("exist");
  });

  it("shows products table with correct headers", () => {
    cy.get("table").should("exist");

    cy.contains("Name").should("exist");
    cy.contains("Description").should("exist");
    cy.contains("Category").should("exist");
    cy.contains("Price").should("exist");
    cy.contains("Stock").should("exist");
    cy.contains("MOQ").should("exist");
  });

  it("shows either empty state or list of products", () => {
    cy.get("tbody tr").then((rows) => {
      if (rows.length === 1) {
        cy.contains("No products found. Create your first product!").should("exist");
      } else if (rows.length > 1) {
        cy.get("tbody tr").eq(1).within(() => {
          cy.get("td").eq(0).should("not.be.empty");   // Name
          cy.get("td").eq(3).should("contain", "₹");   // Price
        });
      }
    });
  });

  it("opens add product dialog when clicking 'Add Product'", () => {
    cy.contains("Add Product").click();

    cy.contains("Create New Product").should("exist");
    cy.get("input#name").should("exist");
    cy.get("input#description").should("exist");
    cy.get("input#price").should("exist");
    cy.get("input#stock").should("exist");
    cy.get("input#category").should("exist");
    cy.get("input#moq").should("exist");
  });

  it("creates a new product from the dialog form", () => {
    cy.contains("Add Product").click();
    cy.contains("Create New Product").should("exist");

    // fill the form
    cy.get("input#name").type("Test Product");
    cy.get("input#description").type("A product created by Cypress");
    cy.get("input#price").type("199.99");
    cy.get("input#stock").type("50");
    cy.get("input#category").type("Test Category");
    cy.get("input#moq").type("5");

    cy.contains("button", "Create Product").click();

    // success toast
    cy.contains("Product created successfully!", { timeout: 10000 }).should("exist");

    // dialog closes
    cy.contains("Create New Product").should("not.exist");

    // table should contain the new product (simple check)
    cy.contains("Test Product").should("exist");
  });
});
