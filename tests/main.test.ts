import { expect, test } from "vitest";
import { toCamelCase } from "../src/utils/toCamelCase";

test("adds 1 + 2 to equal 3", () => {
  expect(toCamelCase("featured-articles")).toBe("featuredArticles");
});
