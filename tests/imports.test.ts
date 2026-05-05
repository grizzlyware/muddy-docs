import { test } from "node:test";
import assert from "node:assert/strict";

// Smoke test: dependency wiring loads. Catches breakage from major SDK bumps
// without needing API keys or a browser.
test("@anthropic-ai/sdk default export is constructable", async () => {
  const mod = await import("@anthropic-ai/sdk");
  const Anthropic = mod.default;
  const client = new Anthropic({ apiKey: "test-key-for-construction" });
  assert.ok(client);
  assert.equal(typeof client.messages.create, "function");
});

test("zod schema parses a basic object", async () => {
  const { z } = await import("zod");
  const schema = z.object({ name: z.string() });
  const parsed = schema.parse({ name: "muddy" });
  assert.equal(parsed.name, "muddy");
});

test("dotenv exposes config()", async () => {
  const dotenv = await import("dotenv");
  assert.equal(typeof dotenv.config, "function");
});

test("@browserbasehq/stagehand exports Stagehand", async () => {
  const { Stagehand } = await import("@browserbasehq/stagehand");
  assert.equal(typeof Stagehand, "function");
});
