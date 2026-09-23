import fs from "fs";
import path from "path";

// Articles link to each other by filename, e.g. [Managing shop orders](managing-shop-orders.md).
// The help centre looks up that article's category and points the link at its page, so a link
// keeps working if an article moves category. These checks catch links that would break.

const LINK = /(?<!!)\[([^\]]*)\]\(([^)\s]+)\)/g;
const ARTICLE_LINK = /^(?:\.\/)?([A-Za-z0-9_-]+)\.md(?:#(.*))?$/;
const HELP_CENTRE_LINK = /^https?:\/\/(?:www\.)?muddybooking\.com\/help\/(?:[^/]+\/)?([A-Za-z0-9_-]+)\/?(#.*)?$/;

/** The id the help centre gives a heading, so `#anchor` links can be checked. */
export function headingAnchor(heading: string): string {
  return heading
    .replace(/[*_`]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/gu, "-")
    .replace(/[^\p{L}\p{Nd}\p{Nl}\p{M}-]+/gu, "");
}

function anchorsIn(markdown: string): Set<string> {
  const anchors = new Set<string>();
  for (const match of markdown.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    anchors.add(headingAnchor(match[1]));
  }
  return anchors;
}

/**
 * Find the links in one article that won't work on the help centre.
 *
 * @param docs Every article's content, keyed by filename without ".md".
 */
export function findLinkProblems(markdown: string, docs: Map<string, string>): string[] {
  const problems: string[] = [];

  for (const [, text, target] of markdown.matchAll(LINK)) {
    if (target.startsWith("#")) {
      if (!anchorsIn(markdown).has(target.slice(1))) {
        problems.push(`[${text}](${target}) points to a heading that isn't in this article.`);
      }
      continue;
    }

    const article = target.match(ARTICLE_LINK);
    if (article) {
      const [, slug, anchor] = article;
      const linked = docs.get(slug);
      if (linked === undefined) {
        problems.push(`[${text}](${target}) points to ${slug}.md, but there's no article with that filename.`);
      } else if (anchor && !anchorsIn(linked).has(anchor)) {
        problems.push(`[${text}](${target}) points to #${anchor}, but ${slug}.md has no heading with that id.`);
      }
      continue;
    }

    const helpCentre = target.match(HELP_CENTRE_LINK);
    if (helpCentre) {
      const [, slug, anchor = ""] = helpCentre;
      problems.push(`[${text}](${target}) is a help centre address. Link to the article's file instead: (${slug}.md${anchor}).`);
      continue;
    }

    if (!/^[a-z][a-z0-9+.-]*:/i.test(target)) {
      const [file, anchor] = target.split("#");
      const slug = path.basename(file).replace(/\.md$/, "");
      problems.push(`[${text}](${target}) is a relative link that isn't an article file. Link to (${slug}.md${anchor ? `#${anchor}` : ""}) instead.`);
    }
  }

  return problems;
}

function loadDocs(docsDir: string): Map<string, string> {
  const docs = new Map<string, string>();
  if (!fs.existsSync(docsDir)) return docs;
  for (const file of fs.readdirSync(docsDir).filter((f) => f.endsWith(".md")).sort()) {
    docs.set(file.replace(/\.md$/, ""), fs.readFileSync(path.join(docsDir, file), "utf-8"));
  }
  return docs;
}

/** Find the broken links in an article before it's saved, checking it against the other articles and itself. */
export function findNewDocLinkProblems(filename: string, content: string, docsDir: string): string[] {
  const docs = loadDocs(docsDir);
  docs.set(filename.replace(/\.md$/, ""), content);
  return findLinkProblems(content, docs);
}

/** Find the broken links in every article in a docs directory, each prefixed with its filename. */
export function findAllLinkProblems(docsDir: string): string[] {
  const docs = loadDocs(docsDir);

  return [...docs].flatMap(([slug, content]) =>
    findLinkProblems(content, docs).map((problem) => `${slug}.md: ${problem}`),
  );
}
