import fs from "fs";
import http from "http";
import path from "path";
import { exec } from "child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs");
const PORT = 3333;

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".css": "text/css",
  ".js": "text/javascript",
};

function listDocs(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
}

function renderIndex(): string {
  const docs = listDocs();
  const links = docs.length
    ? docs
        .map((f) => `<li><a href="/view/${f}">${f.replace(/\.md$/, "").replace(/-/g, " ")}</a></li>`)
        .join("\n")
    : "<li>No docs generated yet. Run <code>npm run generate -- &quot;your task&quot;</code></li>";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Muddy Docs</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 600px; margin: 60px auto; color: #1a1a1a; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
  li { margin: 8px 0; font-size: 1.1em; text-transform: capitalize; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
</style>
</head><body>
<h1>Muddy Docs</h1>
<ul>${links}</ul>
</body></html>`;
}

function renderDoc(filename: string): string | null {
  const filepath = path.join(DOCS_DIR, filename);
  if (!fs.existsSync(filepath)) return null;
  const md = fs.readFileSync(filepath, "utf-8");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${filename.replace(/\.md$/, "")}</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; line-height: 1.6; }
  a { color: #2563eb; }
  img { max-width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; margin: 16px 0; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
  th { background: #f8fafc; }
  blockquote { border-left: 4px solid #e2e8f0; margin: 16px 0; padding: 8px 16px; color: #64748b; }
  h1, h2, h3 { margin-top: 1.5em; }
  .back { display: inline-block; margin-bottom: 20px; }
</style>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
</head><body>
<a class="back" href="/">&larr; All docs</a>
<div id="content"></div>
<script>
  const md = ${JSON.stringify(md)};
  document.getElementById("content").innerHTML = marked.parse(md);
</script>
</body></html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);

  // Index
  if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(renderIndex());
    return;
  }

  // Render a doc
  if (url.pathname.startsWith("/view/")) {
    const filename = path.basename(url.pathname);
    const html = renderDoc(filename);
    if (html) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
    return;
  }

  // Static files (screenshots)
  const safePath = path.normalize(url.pathname).replace(/^\//, "");
  const filePath = path.join(ROOT, safePath);
  if (filePath.startsWith(ROOT) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Serving docs at ${url}`);
  // Open in browser
  const cmd = process.platform === "darwin" ? "open" : "xdg-open";
  exec(`${cmd} ${url}`);
});
