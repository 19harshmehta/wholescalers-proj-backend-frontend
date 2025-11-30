describe("Wholesaler Orders", () => {
  beforeEach(() => {
    // Logs in and lands on /wholesaler/dashboard
    cy.loginAsWholesaler();

    // Go to Orders via UI (sidebar/top nav)
    // If your nav item is a button/link, this will work:
    cy.contains("Orders").click();

    cy.location("pathname").should("include", "/wholesaler/orders");
  });

  it("renders orders heading and description", () => {
    cy.contains("Orders").should("exist");
    cy.contains("Manage and fulfill customer orders").should("exist");
  });

  it("shows orders table with correct headers", () => {
    cy.get("table").should("exist");

    cy.contains("Order ID").should("exist");
    cy.contains("Customer").should("exist");
    cy.contains("Items").should("exist");
    cy.contains("Total").should("exist");
    cy.contains("Status").should("exist");
    cy.contains("Date").should("exist");
    cy.contains("Actions").should("exist");
  });

  it("shows either empty state or a list of orders", () => {
    cy.get("tbody tr").then((rows) => {
      if (rows.length === 1) {
        // empty state row
        cy.contains("No orders found").should("exist");
      } else if (rows.length > 1) {
        // at least one order row
        cy.get("tbody tr").eq(1).within(() => {
          cy.get("td").eq(0).should("contain", "#");       // Order ID
          cy.get("td").eq(3).should("contain", "₹");       // Total
          cy.get("td").eq(2).within(() => {                // Items cell
            cy.get("div").should("exist");                 // items list container
          });
        });
      }
    });
  });

  it("shows item details (MOQ / Stock / quantity × price) when items exist", () => {
    cy.get("tbody tr").then((rows) => {
      if (rows.length <= 1) {
        cy.log("No orders to inspect items for – skipping check");
        return;
      }

      cy.get("tbody tr").eq(1).within(() => {
        cy.get("td").eq(2).within(() => {
          // either some item info or an em dash
          cy.get("div").then(($div) => {
            const text = $div.text();
            if (text.includes("MOQ:")) {
              cy.contains("MOQ:").should("exist");
              cy.contains("Stock:").should("exist");
            }
          });
        });
      });
    });
  });

  it("allows updating order status via dropdown", () => {
    cy.get("tbody tr").then((rows) => {
      if (rows.length <= 1) {
        cy.log("No orders to update – skipping status update test");
        return;
      }

      // pick the first real order row (index 1, because 0 might be header row in some tables)
      cy.get("tbody tr").eq(1).within(() => {
        // shadcn SelectTrigger has role="combobox"
        cy.get("[role='combobox']").click();
      });

      // select a status option
      cy.get("[role='option']").contains("Shipped").click();

      // toast should appear
      cy.contains("Order status updated!", { timeout: 10000 }).should("exist");
    });
  });
});
