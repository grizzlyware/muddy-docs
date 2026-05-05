import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

// Run knowledge tests inside an isolated cwd so we don't touch the real
// knowledge/ directory.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "muddy-docs-test-"));
const originalCwd = process.cwd();
process.chdir(tmp);

const {
  ensureKnowledgeDir,
  saveKnowledge,
  readKnowledge,
  listKnowledgeFiles,
  getKnowledgeSummary,
} = await import("../src/knowledge.js");

test("ensureKnowledgeDir creates the knowledge directory", () => {
  ensureKnowledgeDir();
  assert.ok(fs.existsSync(path.join(tmp, "knowledge")));
});

test("saveKnowledge + readKnowledge round trip", () => {
  saveKnowledge("Pricing Setup", "# Pricing\n\nHello world");
  assert.equal(readKnowledge("Pricing Setup"), "# Pricing\n\nHello world");
});

test("topic names are sanitized to a stable slug", () => {
  saveKnowledge("Booking — Flow!", "x");
  // Read with a different but slug-equivalent topic
  assert.equal(readKnowledge("booking-flow"), "x");
  assert.ok(listKnowledgeFiles().includes("booking-flow"));
});

test("readKnowledge returns null for missing topics", () => {
  assert.equal(readKnowledge("does-not-exist"), null);
});

test("getKnowledgeSummary lists saved topics", () => {
  const summary = getKnowledgeSummary();
  assert.match(summary, /Available knowledge files/);
  assert.match(summary, /pricing-setup/);
});

test.after(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmp, { recursive: true, force: true });
});
