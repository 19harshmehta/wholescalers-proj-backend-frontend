describe("Wholesaler Reports", () => {
  beforeEach(() => {
    // logs in and lands on /wholesaler/dashboard
    cy.loginAsWholesaler();

    // navigate to Reports via the app UI
    // Adjust selector if needed (e.g., scope to nav)
    cy.contains("Reports").click();

    cy.location("pathname").should("include", "/wholesaler/reports");
  });

  it("renders reports heading and description", () => {
    cy.contains("Reports").should("exist");
    cy.contains("Download and export your business data").should("exist");
  });

  it("shows quick download report cards", () => {
    cy.contains("Quick Download Reports").should("exist");

    cy.contains("Sales Report").should("exist");
    cy.contains("Inventory Report").should("exist");
    cy.contains("Customers Report").should("exist");

    cy.contains("All data till date").should("exist");
  });

  it("allows quick sales report download", () => {
    cy.window().then((win) => {
      cy.stub(win.URL, "createObjectURL").as("createObjectURL");
    });

    cy.contains("Sales Report").click();

    cy.get("@createObjectURL").should("have.been.called");
    cy.contains("Report downloaded successfully", { timeout: 10000 }).should("exist");
  });

  it("disables custom download button when dates are missing", () => {
    cy.contains("Generate Custom Report").should("exist");

    cy.contains("button", "Download CSV Report").should("be.disabled");
  });

 

  it("shows about reports section with all descriptions", () => {
    cy.contains("About Reports").should("exist");

    cy.contains("Sales Report:").should("exist");
    cy.contains("Inventory Report:").should("exist");
    cy.contains("Customers Report:").should("exist");

    cy.contains("All reports are generated in CSV format").should("exist");
  });
});
