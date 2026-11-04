import { test } from "node:test";
import assert from "node:assert/strict";
import { localBrowser, Stagehand } from "@browserbasehq/stagehand";
import { launchOptions, setFieldValue } from "../src/browser.js";

const PAGE = `data:text/html,${encodeURIComponent(`
  <label for="brand">Brand colour</label>
  <input id="brand" type="color" value="#1a3629">
  <output id="seen"></output>
  <script>
    document.getElementById("brand").addEventListener("input", (event) => {
      document.getElementById("seen").textContent = event.target.value;
    });
  </script>
`)}`;

test("setFieldValue sets a colour input by its label and fires input", async (t) => {
  let browser;
  let stagehand;
  try {
    browser = await localBrowser.launch(launchOptions(true));
    stagehand = await Stagehand.create({ browser, model: { modelName: "openai/gpt-4.1-mini", apiKey: "unused" } });
  } catch {
    t.skip("Chrome is not available");
    return;
  }

  try {
    const [page] = await browser.context.pages();
    await page.goto(PAGE);

    const result = await setFieldValue(page, "Brand colour", "#6b2fa0");
    const seen = await page.evaluate(() => document.getElementById("seen")?.textContent);

    assert.equal(result, 'Set "Brand colour" to #6b2fa0.');
    assert.equal(seen, "#6b2fa0");
    assert.match(await setFieldValue(page, "Accent colour", "#ff8800"), /No field found/);
  } finally {
    await stagehand.close().catch(() => {});
    await browser.close().catch(() => {});
  }
});
