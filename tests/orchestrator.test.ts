import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt } from "../src/orchestrator.js";

test("the system prompt tells the generator to link to other articles by filename", () => {
  const prompt = buildSystemPrompt("Document the shop", "", [], []);

  assert.match(prompt, /\[Managing shop orders\]\(managing-shop-orders\.md\)/);
  assert.match(prompt, /muddybooking\.com\/help/);
  assert.match(prompt, /list_existing_docs/);
});
