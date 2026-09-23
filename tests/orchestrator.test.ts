import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildSystemPrompt } from "../src/orchestrator.js";

test("the system prompt includes the whole writing guide", () => {
  const guide = fs.readFileSync(path.resolve("WRITING.md"), "utf-8").trim();
  const prompt = buildSystemPrompt("Document the shop", "", [], []);

  assert.ok(prompt.includes(guide), "the prompt should contain WRITING.md word for word");
});

test("the writing guide tells writers to link to other articles by filename", () => {
  const guide = fs.readFileSync(path.resolve("WRITING.md"), "utf-8");

  assert.match(guide, /\[Managing shop orders\]\(managing-shop-orders\.md\)/);
  assert.match(guide, /muddybooking\.com\/help/);
});

test("the system prompt lists the categories and tags already in use", () => {
  const prompt = buildSystemPrompt("Document the shop", "", ["Payments", "Shop"], ["vouchers", "shop"]);

  assert.match(prompt, /"Payments", "Shop"/);
  assert.match(prompt, /"vouchers", "shop"/);
});
