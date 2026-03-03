import "dotenv/config";
import fs from "fs";
import path from "path";
import { closeBrowser, initBrowser, login } from "./src/browser.js";
import { ensureKnowledgeDir } from "./src/knowledge.js";
import { runOrchestrator } from "./src/orchestrator.js";

async function main() {
  const task = process.argv.slice(2).join(" ").trim();

  if (!task) {
    console.error(
      'Usage: npm run generate -- "Document how to setup pricing"',
    );
    process.exit(1);
  }

  console.log(`\n=== Muddy Docs Generator ===`);
  console.log(`Task: "${task}"\n`);

  ensureKnowledgeDir();

  // 1. Launch browser and login
  console.log("--- Initializing browser ---");
  const session = await initBrowser();

  console.log("--- Logging in ---");
  await login(session);

  // 2. Run AI orchestrator
  console.log("\n--- Starting AI orchestrator ---");
  const result = await runOrchestrator(task, session);
  console.log(`\n--- Result ---`);
  console.log(result);

  // 3. Remove unreferenced screenshots
  console.log("\n--- Pruning unused screenshots ---");
  pruneScreenshots();

  // 4. Cleanup
  console.log("\n--- Cleaning up ---");
  await closeBrowser(session);
  console.log("Done!");
}

function pruneScreenshots() {
  const docsDir = path.resolve("docs");
  const screenshotsDir = path.resolve("screenshots");

  if (!fs.existsSync(screenshotsDir)) return;

  // Collect all screenshot filenames referenced in any doc
  const referenced = new Set<string>();
  if (fs.existsSync(docsDir)) {
    for (const file of fs.readdirSync(docsDir).filter((f) => f.endsWith(".md"))) {
      const content = fs.readFileSync(path.join(docsDir, file), "utf-8");
      // Match screenshot filenames in any URL format
      const matches = content.matchAll(/screenshots\/([^\s)]+\.png)/g);
      for (const m of matches) {
        referenced.add(m[1]);
      }
    }
  }

  // Delete any screenshot not referenced by a doc
  let removed = 0;
  for (const file of fs.readdirSync(screenshotsDir)) {
    if (!referenced.has(file)) {
      fs.unlinkSync(path.join(screenshotsDir, file));
      removed++;
    }
  }
  console.log(`  Kept ${referenced.size} screenshots, removed ${removed} unused.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
