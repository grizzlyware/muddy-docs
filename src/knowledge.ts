import fs from "fs";
import path from "path";

const KNOWLEDGE_DIR = path.resolve("knowledge");

export function ensureKnowledgeDir(): void {
  fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
}

export function readKnowledge(topic: string): string | null {
  const filepath = path.join(KNOWLEDGE_DIR, `${sanitizeTopic(topic)}.md`);
  if (!fs.existsSync(filepath)) return null;
  return fs.readFileSync(filepath, "utf-8");
}

export function saveKnowledge(topic: string, content: string): void {
  ensureKnowledgeDir();
  const filepath = path.join(KNOWLEDGE_DIR, `${sanitizeTopic(topic)}.md`);
  fs.writeFileSync(filepath, content, "utf-8");
}

export function listKnowledgeFiles(): string[] {
  ensureKnowledgeDir();
  return fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getKnowledgeSummary(): string {
  const topics = listKnowledgeFiles();
  if (topics.length === 0) {
    return "No existing knowledge. This is the first run — you'll need to explore the app from scratch.";
  }

  let summary = `Available knowledge files (${topics.length}):\n`;
  for (const topic of topics) {
    const content = readKnowledge(topic);
    if (content) {
      // Include first 3 lines as preview
      const preview = content.split("\n").slice(0, 3).join(" ").substring(0, 150);
      summary += `- **${topic}**: ${preview}...\n`;
    }
  }
  return summary;
}

function sanitizeTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
