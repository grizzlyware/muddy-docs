import { test } from "node:test";
import assert from "node:assert/strict";
import { closeBrowser, type BrowserSession } from "../src/browser.js";

const never = () => new Promise<void>(() => {});

test("closeBrowser continues when stagehand.close hangs", async () => {
  let browserClosed = false;
  const session = {
    stagehand: { close: never },
    browser: { close: async () => { browserClosed = true; } },
  } as unknown as BrowserSession;

  const started = Date.now();
  await closeBrowser(session, 50);

  assert.ok(Date.now() - started < 1_000);
  assert.ok(browserClosed);
});

test("closeBrowser continues when both close calls hang or fail", async () => {
  const session = {
    stagehand: { close: async () => { throw new Error("boom"); } },
    browser: { close: never },
  } as unknown as BrowserSession;

  await closeBrowser(session, 50);
});
