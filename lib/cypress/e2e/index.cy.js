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
      "153793551-84bec6f9-70ed-4391-85ad-3c453cbedc49"
    );
    cy.get("[data-test=page-component]").should(
      "have.attr",
      "data-blok-c",
      `{"name":"page","space":"163229","uid":"84bec6f9-70ed-4391-85ad-3c453cbedc49","id":"153793551"}`
    );
  });
  it("globally registered feature component is loaded correctly", () => {
    cy.visit("http://localhost:3000/");
    cy.get("[data-test=feature-component]").should("exist");
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
