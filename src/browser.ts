import { Stagehand } from "@browserbasehq/stagehand";
import fs from "fs";
import path from "path";

const SCREENSHOTS_DIR = path.resolve("screenshots");

export type Page = Awaited<ReturnType<Stagehand["context"]["pages"]>>[0];

export interface BrowserSession {
  stagehand: Stagehand;
  page: Page;
}

export async function initBrowser(): Promise<BrowserSession> {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  fs.mkdirSync(path.resolve("docs"), { recursive: true });

  const headless = process.env.HEADLESS !== "false";

  const stagehand = new Stagehand({
    env: "LOCAL",
    model: "openai/gpt-4.1-mini",
    localBrowserLaunchOptions: {
      headless,
      viewport: { width: 1440, height: 900 },
      args: ["--lang=en-GB"],
    },
  });

  await stagehand.init();
  await stagehand.context.setExtraHTTPHeaders({
    "Sec-GPC": "1",
    "Accept-Language": "en-GB,en;q=0.9",
  });
  const page = stagehand.context.pages()[0];

  return { stagehand, page };
}

export async function login(session: BrowserSession): Promise<void> {
  const { page } = session;
  const email = process.env.MUDDY_EMAIL;
  const password = process.env.MUDDY_PASSWORD;

  if (!email || !password) {
    throw new Error("MUDDY_EMAIL and MUDDY_PASSWORD must be set in .env");
  }

  console.log("  Navigating to login page...");
  await page.goto("https://muddybooking.com/login");
  await page.evaluate(() => localStorage.setItem("newsletter-popup-dismissed", "1"));
  await waitForPage(page);

  console.log("  Filling login form...");
  await page.evaluate(
    ({ email, password }) => {
      const emailInput =
        document.querySelector<HTMLInputElement>('input[type="email"]') ||
        document.querySelector<HTMLInputElement>('input[name="email"]');
      const passwordInput =
        document.querySelector<HTMLInputElement>('input[type="password"]') ||
        document.querySelector<HTMLInputElement>('input[name="password"]');

      if (emailInput) {
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        )!.set!;
        setter.call(emailInput, email);
        emailInput.dispatchEvent(new Event("input", { bubbles: true }));
        emailInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (passwordInput) {
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        )!.set!;
        setter.call(passwordInput, password);
        passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
        passwordInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    },
    { email, password },
  );

  await sleep(500);

  console.log("  Submitting login form...");
  await page.evaluate(() => {
    const btn =
      document.querySelector<HTMLButtonElement>('button[type="submit"]') ||
      Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent?.toLowerCase().includes("sign in"),
      );
    if (btn) btn.click();
  });

  console.log("  Waiting for login to complete (Turnstile auto-solve)...");
  const loginStart = Date.now();
  while (Date.now() - loginStart < 45_000) {
    await sleep(2000);
    const url = page.url();
    if (
      !url.includes("login") &&
      !url.includes("signin") &&
      !url.includes("auth")
    ) {
      console.log("  Login successful!");
      break;
    }
  }

  await waitForPage(page);

  // Verify login succeeded
  const url = page.url();
  if (url.includes("login") || url.includes("signin")) {
    throw new Error("Login failed - still on login page after 45s");
  }

  // Dismiss cookie consent banner if present
  await dismissCookieBanner(page);
}

export async function takeScreenshot(
  page: Page,
  label: string,
  fullPage: boolean = false,
): Promise<string> {
  const slug = label.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const filename = `${slug}-${Date.now()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage });
  console.log(`  Screenshot: ${filename}`);
  return filename;
}

export async function getPageState(page: Page): Promise<{
  url: string;
  title: string;
  textContent: string;
}> {
  const url = page.url();
  const title = await page.title();
  const textContent = await page.evaluate(() => {
    const main =
      document.querySelector("main") ||
      document.querySelector('[class*="content"]') ||
      document.querySelector('[role="main"]') ||
      document.body;
    return (main.innerText || main.textContent || "").trim().substring(0, 5000);
  });
  return { url, title, textContent };
}

export async function getPageLinks(
  page: Page,
): Promise<Array<{ text: string; href: string }>> {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll("a[href]"))
      .map((a) => ({
        text: (a.textContent || "").trim(),
        href: (a as HTMLAnchorElement).href,
      }))
      .filter((l) => l.text.length > 0 && l.text.length < 100);
  });
}

export async function scrollPage(
  page: Page,
  direction: "up" | "down",
): Promise<void> {
  const delta = direction === "down" ? 600 : -600;
  await page.evaluate((d) => window.scrollBy(0, d), delta);
  await sleep(500);
}

export async function highlightElement(
  session: BrowserSession,
  description: string,
  label: string,
): Promise<string> {
  const { page } = session;

  // Parse description in Node.js to extract search name and element type
  const desc = description.toLowerCase();
  // Multi-word suffixes first, then single words — order matters (longest match first)
  const typeWords = [
    "input field", "text area", "text field", "menu item", "date field",
    "time field", "select field", "search field",
    "button", "link", "input", "field", "textarea", "section",
    "heading", "label", "tab", "checkbox", "switch", "select",
    "dropdown", "menu", "option", "icon", "image", "card", "panel",
    "element", "area", "box", "container", "group", "region", "nav",
  ];

  let name = desc.replace(/^the\s+/, "").trim();
  // Keep stripping type words from the end until none match
  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const tw of typeWords) {
      if (name.endsWith(` ${tw}`)) {
        name = name.slice(0, -(tw.length + 1)).trim();
        stripped = true;
        break;
      }
    }
  }
  name = name.replace(/^["']|["']$/g, "").trim();

  const isButton = /button/.test(desc);
  const isLink = /link/.test(desc);
  const isInput = /input|field/.test(desc) && !/text\s*area|textarea/.test(desc);
  const isTextarea = /text\s*area|textarea/.test(desc);

  // Step 1: Find the element's bounding box
  const box = await page.evaluate(
    (args: string[]) => {
      var name = args[0], isButton = args[1] === "1", isLink = args[2] === "1", isInput = args[3] === "1", isTextarea = args[4] === "1";
      var nameLower = name.toLowerCase();
      var el = null;

      if (isButton) {
        var btns = document.querySelectorAll('button, a, [role="button"]');
        // First pass: exact match
        for (var i = 0; i < btns.length; i++) {
          var t = (btns[i].textContent || "").trim().toLowerCase();
          if (t === nameLower && btns[i].getBoundingClientRect().width > 0) { el = btns[i]; break; }
        }
        // Second pass: includes match
        if (!el) {
          for (var i = 0; i < btns.length; i++) {
            var t = (btns[i].textContent || "").trim().toLowerCase();
            if (t.includes(nameLower) && btns[i].getBoundingClientRect().width > 0) { el = btns[i]; break; }
          }
        }
      }

      if (isLink && !el) {
        var as = document.querySelectorAll("a");
        for (var i = 0; i < as.length; i++) {
          var t = (as[i].textContent || "").trim().toLowerCase();
          if (t === nameLower && as[i].getBoundingClientRect().width > 0) { el = as[i]; break; }
        }
        if (!el) {
          for (var i = 0; i < as.length; i++) {
            var t = (as[i].textContent || "").trim().toLowerCase();
            if (t.includes(nameLower) && as[i].getBoundingClientRect().width > 0) { el = as[i]; break; }
          }
        }
      }

      if ((isInput || isTextarea) && !el) {
        var lbls = document.querySelectorAll("label");
        var targetTag = isTextarea ? "textarea" : "input, select";

        // First pass: exact label text match
        for (var i = 0; i < lbls.length && !el; i++) {
          var lt = (lbls[i].textContent || "").trim().toLowerCase();
          if (lt === nameLower) {
            var fid = lbls[i].getAttribute("for");
            if (fid) { var match = document.getElementById(fid); if (match && match.getBoundingClientRect().width > 0) { el = match; } }
            if (!el) { var nd = lbls[i].parentElement; for (var d = 0; d < 5 && nd && !el; d++) { var match = nd.querySelector(targetTag) as HTMLElement | null; if (match && match.getBoundingClientRect().width > 0) { el = match; } nd = nd.parentElement; } }
          }
        }
        // Second pass: includes match
        for (var i = 0; i < lbls.length && !el; i++) {
          var lt = (lbls[i].textContent || "").trim().toLowerCase();
          if (lt.includes(nameLower)) {
            var fid = lbls[i].getAttribute("for");
            if (fid) { var match = document.getElementById(fid); if (match && match.getBoundingClientRect().width > 0) { el = match; } }
            if (!el) { var nd = lbls[i].parentElement; for (var d = 0; d < 5 && nd && !el; d++) { var match = nd.querySelector(targetTag) as HTMLElement | null; if (match && match.getBoundingClientRect().width > 0) { el = match; } nd = nd.parentElement; } }
          }
        }
        // Fallback: find by text content near input (e.g. span/div label + sibling input)
        if (!el) {
          var allText = document.querySelectorAll("span, div, p, h3, h4, h5, h6");
          for (var i = 0; i < allText.length && !el; i++) {
            var tt = (allText[i].textContent || "").trim().toLowerCase();
            if (tt === nameLower) {
              var nd = allText[i].parentElement;
              for (var d = 0; d < 5 && nd && !el; d++) {
                var match = nd.querySelector(targetTag) as HTMLElement | null;
                if (match && match.getBoundingClientRect().width > 0) { el = match; }
                nd = nd.parentElement;
              }
            }
          }
        }
      }

      if (!el) {
        var all = document.querySelectorAll("button, a, input, textarea, select, summary, h1, h2, h3, h4, h5, h6, th, td, label, span, p, li, div");
        for (var i = 0; i < all.length; i++) {
          var t = (all[i].textContent || "").trim().toLowerCase();
          if (t === nameLower && all[i].getBoundingClientRect().width > 0) { el = all[i]; break; }
        }
      }

      if (!el) {
        var all = document.querySelectorAll("button, a, input, textarea, select, summary, h1, h2, h3, h4, h5, h6, th, td, label, span, p, li, div");
        for (var i = 0; i < all.length; i++) {
          var t = (all[i].textContent || "").trim().toLowerCase();
          if (t.includes(nameLower) && all[i].getBoundingClientRect().width > 0) { el = all[i]; break; }
        }
      }

      if (!el) {
        var aria = document.querySelectorAll("[aria-label], [title]");
        for (var i = 0; i < aria.length; i++) {
          var al = (aria[i].getAttribute("aria-label") || "").toLowerCase();
          var ti = (aria[i].getAttribute("title") || "").toLowerCase();
          if ((al.includes(nameLower) || ti.includes(nameLower)) && aria[i].getBoundingClientRect().width > 0) { el = aria[i]; break; }
        }
      }

      if (!el) return null;

      // If there's an open modal/dialog, prefer the match inside it over one behind it
      var topLayer = document.querySelector('dialog[open], [role="dialog"], [class*="modal"]');
      if (topLayer && !topLayer.contains(el)) {
        // Re-search but only within the top-layer element
        var candidates = topLayer.querySelectorAll("button, a, input, textarea, select, summary, h1, h2, h3, h4, h5, h6, th, td, label, span, p, li, div");
        for (var i = 0; i < candidates.length; i++) {
          var t = (candidates[i].textContent || "").trim().toLowerCase();
          if ((t === nameLower || t.includes(nameLower)) && candidates[i].getBoundingClientRect().width > 0) {
            el = candidates[i];
            break;
          }
        }
      }

      // Scroll the element into view so it's visible in viewport screenshots
      el.scrollIntoView({ block: "center", behavior: "instant" });

      var r = el.getBoundingClientRect();
      return [r.left, r.top, r.width, r.height];
    },
    [name, isButton ? "1" : "", isLink ? "1" : "", isInput ? "1" : "", isTextarea ? "1" : ""],
  );

  if (!box) {
    return `Could not find element: "${description}"`;
  }

  // Step 2: Inject the highlight overlay
  await page.evaluate(
    (args: string) => {
      var p = JSON.parse(args);
      var bx = p[0], by = p[1], bw = p[2], bh = p[3], label = p[4];
      var sx = window.scrollX;
      var sy = window.scrollY;

      var border = document.createElement("div");
      border.className = "muddy-docs-highlight";
      border.style.position = "absolute";
      border.style.left = (bx + sx - 3) + "px";
      border.style.top = (by + sy - 3) + "px";
      border.style.width = (bw + 6) + "px";
      border.style.height = (bh + 6) + "px";
      border.style.border = "3px solid #e11d48";
      border.style.borderRadius = "6px";
      border.style.pointerEvents = "none";
      border.style.zIndex = "99999";
      border.style.boxSizing = "border-box";

      var badge = document.createElement("div");
      badge.className = "muddy-docs-highlight";
      badge.style.position = "absolute";
      badge.style.left = (bx + sx + bw - 4) + "px";
      badge.style.top = (by + sy - 12) + "px";
      badge.style.width = "24px";
      badge.style.height = "24px";
      badge.style.backgroundColor = "#e11d48";
      badge.style.color = "#fff";
      badge.style.borderRadius = "50%";
      badge.style.display = "flex";
      badge.style.alignItems = "center";
      badge.style.justifyContent = "center";
      badge.style.fontSize = "13px";
      badge.style.fontWeight = "700";
      badge.style.fontFamily = "system-ui, sans-serif";
      badge.style.pointerEvents = "none";
      badge.style.zIndex = "100000";
      badge.style.lineHeight = "1";
      badge.textContent = label;

      document.body.appendChild(border);
      document.body.appendChild(badge);
    },
    JSON.stringify([box[0], box[1], box[2], box[3], label]),
  );

  return `Highlighted "${description}" with label (${label})`;
}

export async function clearHighlights(page: Page): Promise<void> {
  await page.evaluate(() => {
    document
      .querySelectorAll(".muddy-docs-highlight")
      .forEach((el) => el.remove());
  });
}

export async function closeBrowser(
  session: BrowserSession,
): Promise<void> {
  await session.stagehand.close();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function dismissCookieBanner(page: Page): Promise<void> {
  try {
    // Try clicking an accept/allow button first (properly dismisses the banner)
    const clicked = await page.evaluate(() => {
      const buttonSelectors = [
        '[class*="cookie"] button',
        '[id*="cookie"] button',
        '[class*="consent"] button',
        '[id*="consent"] button',
        'button[class*="cookie"]',
        'button[class*="consent"]',
        'button[class*="accept"]',
      ];
      for (const sel of buttonSelectors) {
        const buttons = document.querySelectorAll<HTMLButtonElement>(sel);
        for (const btn of buttons) {
          const text = (btn.textContent || "").toLowerCase();
          if (text.includes("accept") || text.includes("allow") || text.includes("agree") || text.includes("consent") || text.includes("ok")) {
            btn.click();
            return true;
          }
        }
      }
      // Fallback: find any button with accept-like text
      for (const btn of document.querySelectorAll<HTMLButtonElement>("button")) {
        const text = (btn.textContent || "").toLowerCase().trim();
        if (text === "accept" || text === "accept all" || text === "allow cookies" || text === "allow all" || text.includes("i consent") || text.includes("yes, i consent")) {
          btn.click();
          return true;
        }
      }
      return false;
    });
    if (clicked) {
      console.log("  Dismissed cookie banner.");
      await sleep(500);
    }
  } catch {
    // Not critical if this fails
  }
  // Remove any remaining cookie/consent elements from the DOM
  await removeCookieElements(page);
}

async function removeCookieElements(page: Page): Promise<void> {
  await page.evaluate(() => {
    const selectors = [
      '[class*="cookie"]',
      '[id*="cookie"]',
      '[class*="consent"]',
      '[id*="consent"]',
      '[class*="cc-"]',
      '[aria-label*="cookie" i]',
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }
  });
}

export async function waitForPage(page: Page): Promise<void> {
  try {
    await page.waitForLoadState("networkidle");
  } catch {
    // networkidle timeout is OK
  }
  await sleep(2000);
  // Also clear any cookie banners that appeared after navigation
  await removeCookieElements(page);
}
