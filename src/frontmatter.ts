import fs from "fs";
import path from "path";

// The help centre parses frontmatter with a strict YAML parser. An unquoted value containing
// ": " or " #" fails to parse, and one bad article stops the whole help centre refreshing.

/** Find frontmatter values that need quoting before a YAML parser will accept them. */
export function findFrontmatterProblems(content: string): string[] {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1];
  if (frontmatter === undefined) return ["The article has no frontmatter."];

  const problems: string[] = [];
  for (const line of frontmatter.split("\n")) {
    const value = line.match(/^\s*(?:-\s+|[A-Za-z_]+:\s+)(.+)$/)?.[1].trim();
    if (!value || /^["'|>]/.test(value)) continue;
    if (/:\s/.test(value) || /\s#/.test(value)) {
      problems.push(`"${line.trim()}" has a colon or " #" in an unquoted value, which breaks the help centre. Reword it, or wrap the value in double quotes.`);
    }
  }
  return problems;
}

/** Find frontmatter problems in every article in a docs directory, each prefixed with its filename. */
export function findAllFrontmatterProblems(docsDir: string): string[] {
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .flatMap((file) =>
      findFrontmatterProblems(fs.readFileSync(path.join(docsDir, file), "utf-8")).map((p) => `${file}: ${p}`),
    );
}
