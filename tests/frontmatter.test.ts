import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { findAllFrontmatterProblems, findFrontmatterProblems } from "../src/frontmatter.js";

const wrap = (frontmatter: string) => `---\n${frontmatter}\n---\n\n## Hi`;

test("plain values are fine", () => {
  assert.deepEqual(findFrontmatterProblems(wrap("title: Setting up pricing\ntags:\n  - pricing\norder: 10")), []);
});

test("an unquoted value containing a colon is a problem", () => {
  const problems = findFrontmatterProblems(wrap("description: Reference for the embed: triggers and events."));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /description/);
});

test("a colon in a tag is a problem too", () => {
  assert.equal(findFrontmatterProblems(wrap("tags:\n  - a: b")).length, 1);
});

test("an unquoted value containing ' #' is a problem, as YAML reads the rest as a comment", () => {
  assert.equal(findFrontmatterProblems(wrap("title: Booking #1 explained")).length, 1);
});

test("quoted values and times without a following space are fine", () => {
  assert.deepEqual(findFrontmatterProblems(wrap('description: "Reference: triggers and events."\ntitle: Open 09:00 to 17:00')), []);
});

test("an article without frontmatter is a problem", () => {
  assert.equal(findFrontmatterProblems("## Hi").length, 1);
});

test("every published article's frontmatter parses", () => {
  assert.deepEqual(findAllFrontmatterProblems(path.resolve("docs")), []);
});
