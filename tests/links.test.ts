import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { findAllLinkProblems, findLinkProblems, headingAnchor } from "../src/links.js";

const docs = new Map<string, string>([
  ["managing-shop-orders", "## Returns\n\n### Refunding without a return\n\nText."],
  ["setting-up-shop-delivery", "## Step 1 — Add a delivery method\n\n## Limits\n\nText."],
]);

test("a link to another article by filename is fine", () => {
  assert.deepEqual(findLinkProblems("See [orders](managing-shop-orders.md).", docs), []);
  assert.deepEqual(findLinkProblems("See [orders](./managing-shop-orders.md).", docs), []);
});

test("a link to a heading in another article is fine when the heading exists", () => {
  assert.deepEqual(findLinkProblems("See [refunds](managing-shop-orders.md#refunding-without-a-return).", docs), []);
});

test("a link to an article that does not exist is a problem", () => {
  const problems = findLinkProblems("See [orders](managing-orders.md).", docs);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /managing-orders\.md/);
  assert.match(problems[0], /no article/i);
});

test("a link to a heading that does not exist is a problem", () => {
  const problems = findLinkProblems("See [refunds](managing-shop-orders.md#refunds).", docs);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /#refunds/);
});

test("a link to a heading in the same article is checked against that article", () => {
  const own = "## Limits\n\nSee [limits](#limits) and [nowhere](#nowhere).";
  const problems = findLinkProblems(own, docs);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /#nowhere/);
});

test("a full help centre address is a problem, because it breaks when an article changes category", () => {
  const problems = findLinkProblems(
    "See [orders](https://muddybooking.com/help/shop/managing-shop-orders).",
    docs,
  );
  assert.equal(problems.length, 1);
  assert.match(problems[0], /managing-shop-orders\.md/);
});

test("a relative link that is not an article filename is a problem", () => {
  const problems = findLinkProblems("See [the API](./embed-javascript-api).", docs);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /embed-javascript-api\.md/);
});

test("images, outside websites and email addresses are not checked", () => {
  const markdown = [
    "![Screenshot](../screenshots/orders-1.png)",
    "[Stripe](https://stripe.com/docs)",
    "[Our site](https://muddybooking.com/pricing)",
    "[Email us](mailto:help@muddybooking.com)",
  ].join("\n");
  assert.deepEqual(findLinkProblems(markdown, docs), []);
});

test("heading anchors match the ids the help centre gives headings", () => {
  assert.equal(headingAnchor("Refunding without a return"), "refunding-without-a-return");
  assert.equal(headingAnchor("Step 1 — Add a delivery method"), "step-1--add-a-delivery-method");
  assert.equal(headingAnchor("What does this discount apply to?"), "what-does-this-discount-apply-to");
});

test("findAllLinkProblems names the file each problem is in", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "muddy-docs-links-"));
  fs.writeFileSync(path.join(dir, "one.md"), "---\ntitle: One\n---\n\nSee [two](two.md) and [three](three.md).");
  fs.writeFileSync(path.join(dir, "two.md"), "---\ntitle: Two\n---\n\n## Hello");

  const problems = findAllLinkProblems(dir);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /^one\.md: /);
  assert.match(problems[0], /three\.md/);
});

test("every link in the published docs works", () => {
  assert.deepEqual(findAllLinkProblems(path.resolve("docs")), []);
});

test("findNewDocLinkProblems checks a new article against the existing ones and itself", async () => {
  const { findNewDocLinkProblems } = await import("../src/links.js");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "muddy-docs-new-"));
  fs.writeFileSync(path.join(dir, "existing.md"), "---\ntitle: Existing\n---\n\n## Hello");

  const content = "---\ntitle: New\n---\n\n## Mine\n\nSee [existing](existing.md#hello), [mine](new.md#mine) and [gone](gone.md).";

  const problems = findNewDocLinkProblems("new.md", content, dir);

  assert.equal(problems.length, 1);
  assert.match(problems[0], /gone\.md/);
});
