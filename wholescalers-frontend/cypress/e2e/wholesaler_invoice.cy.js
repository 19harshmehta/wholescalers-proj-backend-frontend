describe("Wholesaler Invoices", () => {
  beforeEach(() => {
    // This already logs in and ends on /wholesaler/dashboard
    cy.loginAsWholesaler();

    // Navigate to invoices via UI (sidebar/top nav etc.)
    cy.contains("Invoices").click();
    cy.location("pathname").should("include", "/wholesaler/invoices");
  });

  it("renders page heading and description", () => {
    cy.contains("Invoices").should("exist");
    cy.contains("Create and manage invoices for orders").should("exist");
  });

  it("shows invoice table with correct headers", () => {
    cy.get("table").should("exist");

    cy.contains("Order ID").should("exist");
    cy.contains("Customer").should("exist");
    cy.contains("Amount").should("exist");
    cy.contains("Status").should("exist");
    cy.contains("Date").should("exist");
    cy.contains("Actions").should("exist");
  });

  it("shows either empty state or list of orders", () => {
    cy.get("tbody tr").then((rows) => {
      if (rows.length === 1) {
        // likely the empty state row
        cy.contains("No orders available for invoicing").should("exist");
      } else if (rows.length > 1) {
        // we have at least one actual order row
        cy.get("tbody tr").eq(1).within(() => {
          cy.get("td").eq(0).should("contain", "#");  // Order ID
          cy.get("td").eq(2).should("contain", "₹");  // Amount
        });
      }
    });
  });

  it("creates an invoice when 'Create Invoice' button exists", () => {
    cy.get("body").then(($body) => {
      const hasCreate = $body.text().includes("Create Invoice");

      if (!hasCreate) {
        cy.log("No pending orders to create invoice for – skipping assertion");
        return;
      }

      cy.contains("Create Invoice").first().click();

      cy.contains("Invoice created successfully!", { timeout: 10000 }).should("exist");
      cy.contains("Created").should("exist");
      cy.contains("Download Invoice").should("exist");
    });
  });

  it("downloads invoice when 'Download Invoice' button exists", () => {
    cy.get("body").then(($body) => {
      const hasDownload = $body.text().includes("Download Invoice");

      if (!hasDownload) {
        cy.log("No invoiced orders to download – skipping assertion");
        return;
      }

      cy.window().then((win) => {
        cy.stub(win.URL, "createObjectURL").as("createObjectURL");
      });

      cy.contains("Download Invoice").first().click();

      cy.get("@createObjectURL").should("have.been.called");
      cy.contains("Invoice downloaded successfully", { timeout: 10000 }).should("exist");
    });
  });
});
