import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { findAllCategoryDescriptionProblems, findCategoryDescriptionProblems } from "../src/categories.js";

function article(category: string, order: number, description?: string): string {
  return `---\ntitle: T\ncategory: ${category}\norder: ${order}\n${description ? `category_description: ${description}\n` : ""}---\n\n## Hi`;
}

test("one description on the lowest-ordered article is fine", () => {
  const docs = new Map([
    ["a.md", article("Bookings", 10, "About bookings.")],
    ["b.md", article("Bookings", 40)],
  ]);
  assert.deepEqual(findCategoryDescriptionProblems(docs), []);
});

test("a category with no description is fine", () => {
  assert.deepEqual(findCategoryDescriptionProblems(new Map([["a.md", article("Bookings", 10)]])), []);
});

test("any article sharing the lowest order may carry the description", () => {
  const docs = new Map([
    ["a.md", article("Payments", 20)],
    ["b.md", article("Payments", 20, "About payments.")],
  ]);
  assert.deepEqual(findCategoryDescriptionProblems(docs), []);
});

test("a description set in two articles of the same category is a problem", () => {
  const docs = new Map([
    ["a.md", article("Bookings", 10, "One.")],
    ["b.md", article("Bookings", 40, "Two.")],
  ]);
  const problems = findCategoryDescriptionProblems(docs);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /Bookings/);
  assert.match(problems[0], /a\.md, b\.md/);
});

test("a description on an article that isn't the lowest-ordered is a problem", () => {
  const docs = new Map([
    ["a.md", article("Bookings", 10)],
    ["b.md", article("Bookings", 40, "About bookings.")],
  ]);
  const problems = findCategoryDescriptionProblems(docs);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /b\.md/);
  assert.match(problems[0], /a\.md/);
});

test("categories are checked separately", () => {
  const docs = new Map([
    ["a.md", article("Bookings", 10, "About bookings.")],
    ["b.md", article("Payments", 10, "About payments.")],
  ]);
  assert.deepEqual(findCategoryDescriptionProblems(docs), []);
});

test("every category in the published docs has at most one description, on its first article", () => {
  assert.deepEqual(findAllCategoryDescriptionProblems(path.resolve("docs")), []);
});
