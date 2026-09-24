import fs from "fs";
import path from "path";

// The help centre shows a category's description from the category_description field of one
// of its articles. WRITING.md says only the lowest-ordered article in a category sets it, so
// there's never a question of which description wins.

interface Article {
  file: string;
  category?: string;
  order: number;
  hasCategoryDescription: boolean;
}

function readArticle(file: string, content: string): Article {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? "";
  const field = (name: string) => frontmatter.match(new RegExp(`^${name}:\\s*(.*)$`, "m"))?.[1].trim();
  return {
    file,
    category: field("category"),
    order: Number(field("order") ?? Infinity),
    hasCategoryDescription: Boolean(field("category_description")),
  };
}

/**
 * Find categories whose description is set more than once, or not on the lowest-ordered article.
 *
 * @param docs Every article's content, keyed by filename.
 */
export function findCategoryDescriptionProblems(docs: Map<string, string>): string[] {
  const categories = new Map<string, Article[]>();
  for (const [file, content] of docs) {
    const article = readArticle(file, content);
    if (!article.category) continue;
    categories.set(article.category, [...(categories.get(article.category) ?? []), article]);
  }

  const problems: string[] = [];
  for (const [category, articles] of categories) {
    const described = articles.filter((a) => a.hasCategoryDescription);
    const lowest = Math.min(...articles.map((a) => a.order));

    if (described.length > 1) {
      problems.push(`"${category}" has a category_description in ${described.map((a) => a.file).join(", ")}. Keep it in one article, the one with the lowest order.`);
    } else if (described.length === 1 && described[0].order !== lowest) {
      const expected = articles.filter((a) => a.order === lowest).map((a) => a.file).join(" or ");
      problems.push(`"${category}" has its category_description in ${described[0].file}, but the lowest-ordered article is ${expected}. Move it there.`);
    }
  }
  return problems;
}

/** Find category description problems across every article in a docs directory. */
export function findAllCategoryDescriptionProblems(docsDir: string): string[] {
  const docs = new Map<string, string>();
  for (const file of fs.readdirSync(docsDir).filter((f) => f.endsWith(".md")).sort()) {
    docs.set(file, fs.readFileSync(path.join(docsDir, file), "utf-8"));
  }
  return findCategoryDescriptionProblems(docs);
}
