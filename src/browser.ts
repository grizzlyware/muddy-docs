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
    model: "openai/gpt-4.1",
    localBrowserLaunchOptions: {
      headless,
    },
  });

  await stagehand.init();
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
): Promise<string> {
  const slug = label.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const filename = `${slug}-${Date.now()}.png`;
  const filepath = path.join(SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: false });
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
  const { stagehand, page } = session;

  // Use Stagehand to find the element
  const actions = await stagehand.observe(`Find: ${description}`);
  if (actions.length === 0) {
    return `Could not find element: "${description}"`;
  }

  // Strip the "xpath=" prefix that Stagehand adds
  const selector = actions[0].selector.replace(/^xpath=/, "");

  const applied = await page.evaluate(
    ({ selector, label }) => {
      const el = document.evaluate(
        selector,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue as HTMLElement | null;
      if (!el) return false;

      const rect = el.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      // Highlight border
      const border = document.createElement("div");
      border.className = "muddy-docs-highlight";
      Object.assign(border.style, {
        position: "absolute",
        left: `${rect.left + scrollX - 3}px`,
        top: `${rect.top + scrollY - 3}px`,
        width: `${rect.width + 6}px`,
        height: `${rect.height + 6}px`,
        border: "3px solid #e11d48",
        borderRadius: "6px",
        pointerEvents: "none",
        zIndex: "99999",
        boxSizing: "border-box",
      });

      // Numbered badge
      const badge = document.createElement("div");
      badge.className = "muddy-docs-highlight";
      Object.assign(badge.style, {
        position: "absolute",
        left: `${rect.left + scrollX + rect.width - 4}px`,
        top: `${rect.top + scrollY - 12}px`,
        width: "24px",
        height: "24px",
        backgroundColor: "#e11d48",
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: "700",
        fontFamily: "system-ui, sans-serif",
        pointerEvents: "none",
        zIndex: "100000",
        lineHeight: "1",
      });
      badge.textContent = label;

      document.body.appendChild(border);
      document.body.appendChild(badge);
      return true;
    },
    { selector, label },
  );

  if (!applied) {
    return `Found element but could not highlight: "${description}"`;
  }
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
          if (text.includes("accept") || text.includes("allow") || text.includes("agree") || text.includes("ok")) {
            btn.click();
            return true;
          }
        }
      }
      // Fallback: find any button with accept-like text
      for (const btn of document.querySelectorAll<HTMLButtonElement>("button")) {
        const text = (btn.textContent || "").toLowerCase().trim();
        if (text === "accept" || text === "accept all" || text === "allow cookies" || text === "allow all") {
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

async function waitForPage(page: Page): Promise<void> {
  try {
    await page.waitForLoadState("networkidle");
  } catch {
    // networkidle timeout is OK
  }
  await sleep(2000);
  // Remove common overlays that block content
  await page.evaluate(() => {
    const selectors = [
      '[class*="popup"]',
      '[class*="overlay"]',
      '[class*="newsletter"]',
      '[role="dialog"]',
      '[class*="klaviyo"]',
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }
  });
  // Also clear any cookie banners that appeared after navigation
  await removeCookieElements(page);
}
