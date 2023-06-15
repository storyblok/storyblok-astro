/*
Tests:
- Bridge should be loaded
- storyblokEditable attributes are assigned
- globally loaded component is rendered correctly
*/

describe("@storyblok/astro", () => {
  it("is loaded", () => {
    cy.visit("http://localhost:3000/");
    cy.get("#storyblok-javascript-bridge").should("exist");
  });
  it("storyblokEditable adds correct attributes", () => {
    cy.visit("http://localhost:3000/");
    cy.get("[data-test=page-component]").should(
      "have.attr",
      "data-blok-uid",
      "291636474-b0efb26b-f00a-455f-8862-4a6e650c1d4d"
    );
    cy.get("[data-test=page-component]").should(
      "have.attr",
      "data-blok-c",
      `{"name":"page","space":"221046","uid":"b0efb26b-f00a-455f-8862-4a6e650c1d4d","id":"291636474"}`
    );
  });
  it("globally registered feature component is loaded correctly", () => {
    cy.visit("http://localhost:3000/");
    cy.get("[data-test=feature-component]").should("exist");
  });
  it("Custom FallbackComponent is loaded correctly", () => {
    cy.visit("http://localhost:3000/");
    cy.get("[data-test=custom-fallback-component]").should("exist");
  });
  it("RichText Renderer renders embedded bloks correctly", () => {
    cy.visit("http://localhost:3000/");
    cy.get("[data-test=embedded-blok]").should("exist");
  });
  /*describe("Bridge", () => {
    it("Is loaded by default", () => {
      cy.visit("http://localhost:3000/");
      cy.get(".with-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("exist");
    });

    it("Is not loaded if options.bridge: false and errors in console", () => {
      cy.visit("http://localhost:3000/");
      cy.get(".without-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("not.exist");
    });
  });
  describe("Bridge (added independently)", () => {
    it("Can be loaded", () => {
      cy.visit("http://localhost:3000/");
      cy.get(".load-bridge").click();
      cy.get("#storyblok-javascript-bridge").should("exist");
    });
    it("Can be loaded just once", () => {
      cy.visit("http://localhost:3000/");
      cy.get(".load-bridge").click();
      cy.wait(1000);
      cy.get(".load-bridge").click();
      cy.get("#storyblok-javascript-bridge")
        .should("exist")
        .and("have.length", 1);
    });
  });*/
});
