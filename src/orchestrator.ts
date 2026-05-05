import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import {
  type BrowserSession,
  clearHighlights,
  getPageLinks,
  getPageState,
  highlightElement,
  scrollPage,
  sleep,
  takeScreenshot,
  waitForPage,
} from "./browser.js";
import {
  getKnowledgeSummary,
  listKnowledgeFiles,
  readKnowledge,
  saveKnowledge,
} from "./knowledge.js";

const DOCS_DIR = path.resolve("docs");
const SCREENSHOTS_DIR = path.resolve("screenshots");
const SOFT_TURN_LIMIT = 100;
const HARD_TURN_LIMIT = 200;
const FINAL_WARNING_TURN = HARD_TURN_LIMIT - 10;

function getExistingCategories(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  const categories = new Set<string>();
  for (const file of fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"))) {
    const content = fs.readFileSync(path.join(DOCS_DIR, file), "utf-8");
    const match = content.match(/^---\s*\n[\s\S]*?\ncategory:\s*(.+)\n[\s\S]*?\n---/);
    if (match) {
      categories.add(match[1].trim());
    }
  }
  return Array.from(categories).sort();
}

function getExistingTags(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  const tags = new Set<string>();
  for (const file of fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"))) {
    const content = fs.readFileSync(path.join(DOCS_DIR, file), "utf-8");
    const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatter) {
      const tagMatches = frontmatter[1].match(/tags:\s*\n((?:\s+-\s+.+\n?)*)/);
      if (tagMatches) {
        for (const line of tagMatches[1].split("\n")) {
          const tag = line.match(/^\s+-\s+(.+)/);
          if (tag) tags.add(tag[1].trim());
        }
      }
    }
  }
  return Array.from(tags).sort();
}

const tools: Anthropic.Tool[] = [
  {
    name: "navigate_to_url",
    description:
      "Navigate the browser to a specific URL. Use this to go to pages in the app. Wait for the page to load before taking other actions.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: { type: "string", description: "The full URL to navigate to" },
      },
      required: ["url"],
    },
  },
  {
    name: "click_element",
    description:
      "Click an element on the page using a natural language description. The AI browser agent will find and click the matching element.",
    input_schema: {
      type: "object" as const,
      properties: {
        description: {
          type: "string",
          description:
            'Atomic description of what to click, e.g. "the Pricing link in the sidebar" or "the Save button"',
        },
      },
      required: ["description"],
    },
  },
  {
    name: "type_into_field",
    description: "Type text into a form field on the page.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description:
            'Full instruction e.g. "Type \'hello\' into the search input"',
        },
      },
      required: ["instruction"],
    },
  },
  {
    name: "get_page_state",
    description:
      "Get the current page URL, title, and visible text content. Use this to understand where you are and what's on the page.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "extract_data",
    description:
      "Extract specific structured data from the current page using AI. Give a clear instruction about what data you want.",
    input_schema: {
      type: "object" as const,
      properties: {
        instruction: {
          type: "string",
          description:
            'What to extract, e.g. "all pricing tiers with their names, descriptions, and costs"',
        },
      },
      required: ["instruction"],
    },
  },
  {
    name: "list_page_links",
    description:
      "List all visible links on the current page with their text and URLs. Useful for discovering navigation structure.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "take_screenshot",
    description:
      "Take a screenshot of the current page. By default captures only the visible viewport. Set full_page to true to capture the entire scrollable page (useful for long pages like calendars or settings).",
    input_schema: {
      type: "object" as const,
      properties: {
        label: {
          type: "string",
          description:
            'Short descriptive label, e.g. "pricing-page-overview"',
        },
        full_page: {
          type: "boolean",
          description: "Capture the entire scrollable page instead of just the viewport. Default: false.",
        },
      },
      required: ["label"],
    },
  },
  {
    name: "scroll_page",
    description: "Scroll the page up or down to see more content.",
    input_schema: {
      type: "object" as const,
      properties: {
        direction: {
          type: "string",
          enum: ["up", "down"],
          description: "Direction to scroll",
        },
      },
      required: ["direction"],
    },
  },
  {
    name: "highlight_element",
    description:
      "Highlight an element on the page with a numbered badge. Use this BEFORE taking a screenshot to annotate important elements. The highlight appears as a red border with a circled number. Reference the number in your documentation text, e.g. 'Enter your base price **(1)**'.",
    input_schema: {
      type: "object" as const,
      properties: {
        description: {
          type: "string",
          description:
            'Natural language description of the element to highlight, e.g. "the Base Price input field"',
        },
        label: {
          type: "string",
          description:
            'The number or short label for the badge, e.g. "1", "2", "3"',
        },
      },
      required: ["description", "label"],
    },
  },
  {
    name: "clear_highlights",
    description:
      "Remove all annotation highlights from the page. Call this after taking an annotated screenshot, before navigating or taking a clean screenshot.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "list_tabs",
    description:
      "List all open browser tabs with their index, URL, and title. Use this to see if a new tab has opened (e.g. after clicking a link that opens in a new tab).",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "switch_tab",
    description:
      "Switch to a different browser tab by its index (from list_tabs). Use this when a new tab has opened and you need to interact with it, or to switch back to the original tab.",
    input_schema: {
      type: "object" as const,
      properties: {
        tab_index: {
          type: "number",
          description: "The tab index to switch to (0-based, from list_tabs)",
        },
      },
      required: ["tab_index"],
    },
  },
  {
    name: "read_knowledge",
    description:
      "Read a knowledge file from the persistent store. Returns the content or a message if not found.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: {
          type: "string",
          description:
            'The topic name, e.g. "app-navigation" or "pricing"',
        },
      },
      required: ["topic"],
    },
  },
  {
    name: "save_knowledge",
    description:
      "Save knowledge to the persistent store for future tasks. Record app structure, navigation patterns, URL structures, and feature layouts you discover. This persists across runs.",
    input_schema: {
      type: "object" as const,
      properties: {
        topic: {
          type: "string",
          description: "The topic name for this knowledge",
        },
        content: {
          type: "string",
          description: "Markdown content to save",
        },
      },
      required: ["topic", "content"],
    },
  },
  {
    name: "list_knowledge_files",
    description: "List all available knowledge files in the persistent store.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "list_existing_docs",
    description:
      "List all existing documentation files with their frontmatter metadata (title, slug, category). Use this at the start of a task to check if a doc on this topic already exists so you can overwrite it rather than creating a duplicate.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "read_documentation",
    description:
      "Read the contents of an existing documentation file. Use this to review a doc before improving or rewriting it.",
    input_schema: {
      type: "object" as const,
      properties: {
        filename: {
          type: "string",
          description:
            'The filename to read (no directory), e.g. "setting-up-pricing.md"',
        },
      },
      required: ["filename"],
    },
  },
  {
    name: "delete_documentation",
    description:
      "Delete an existing documentation file. Use this to remove an old doc before writing a replacement with finish_documentation, or to clean up duplicates.",
    input_schema: {
      type: "object" as const,
      properties: {
        filename: {
          type: "string",
          description:
            'The filename to delete (no directory), e.g. "setting-up-pricing.md"',
        },
      },
      required: ["filename"],
    },
  },
  {
    name: "finish_documentation",
    description:
      "Write the final documentation markdown file and complete the task. The markdown_content MUST begin with YAML frontmatter (title, category, tags, order, description, pinned). Call this when you have gathered enough information and are ready to produce the output.",
    input_schema: {
      type: "object" as const,
      properties: {
        filename: {
          type: "string",
          description:
            'Output filename (no directory), e.g. "setting-up-pricing.md"',
        },
        markdown_content: {
          type: "string",
          description: "The complete markdown documentation content",
        },
      },
      required: ["filename", "markdown_content"],
    },
  },
];

function buildSystemPrompt(task: string, knowledgeSummary: string, existingCategories: string[], existingTags: string[]): string {
  return `You are a documentation assistant for Muddy Booking (muddybooking.com), a booking management platform for dog walking businesses. You control a web browser that is already logged into the app.

## Your Task
"${task}"

Today's date is ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.

## Step budget
You have a budget of tool-using turns. Aim to complete the task in ${SOFT_TURN_LIMIT} turns. ${HARD_TURN_LIMIT} is the hard maximum — if you reach it without calling finish_documentation, the run aborts with no output.

Spend turns efficiently:
- Skip pages and settings that are not directly relevant to the task.
- Don't re-screenshot or re-read content you already captured.
- Prefer one well-chosen full_page screenshot over several partial ones.
- Once you have enough material, call finish_documentation rather than continuing to polish.

After turn ${SOFT_TURN_LIMIT} you'll start receiving reminders to wrap up. Treat them as deadline pressure: stop exploring nice-to-haves, finish what's needed for an accurate doc, and call finish_documentation. After turn ${FINAL_WARNING_TURN} the reminder becomes urgent — call finish_documentation immediately with whatever you have, even if incomplete.

## Existing Knowledge
${knowledgeSummary}

## Instructions
1. First, call list_existing_docs to check if a doc on this topic already exists. If it does, call read_documentation to read it. Decide whether you need to REPLACE it entirely or just IMPROVE specific parts (e.g. redo a screenshot, fix a section). Either way, you'll delete the old one and write the new one with the same filename.
2. If you're improving an existing doc, keep everything that's already good — only redo the parts mentioned in the task. Re-use existing screenshot filenames where the screenshots don't need changing.
3. Check existing knowledge files to understand the app structure (if any exist)
4. Navigate to the relevant pages — use the sidebar navigation or direct URLs
5. Take screenshots at key views to include in the documentation
6. Extract relevant data and content from pages
7. Save structural knowledge you discover (navigation links, URL patterns, settings layout) for future tasks
8. When you have enough information: if replacing an existing doc, call delete_documentation first, then call finish_documentation with the same filename. If creating a new doc, just call finish_documentation.

## Documentation Format
Every documentation file MUST begin with YAML frontmatter. Use this exact format:
\`\`\`
---
title: Setting up pricing
category: Getting started
tags:
  - pricing
  - walks
  - settings
order: 10
description: Learn how to configure base pricing, walk-specific pricing, and discounts.
pinned: false
category_description: Essential guides to help you set up and start using Muddy Booking.
---
\`\`\`
- **title**: A clear, human-readable title for the article
- **category**: A broad grouping. ${existingCategories.length > 0 ? `REUSE an existing category if it fits: ${existingCategories.map((c) => `"${c}"`).join(", ")}. Only create a new category if none of these are suitable.` : `Examples: "Getting started", "Settings", "Bookings", "Customers", "Calendar".`} The "Getting started" category is special — it is shown first on the website. Use it for topics a new user would need early on (e.g. initial setup, first bookings, key settings). Don't put every article in it — only ones relevant to someone just starting out.
- **tags**: 2-5 relevant keywords for search and filtering. ${existingTags.length > 0 ? `REUSE existing tags where they fit: ${existingTags.map((t) => `"${t}"`).join(", ")}. Only create a new tag if none of these are suitable.` : `Examples: "pricing", "walks", "settings", "bookings", "customers".`}
- **order**: A number for sorting within the category (10, 20, 30... — use multiples of 10 so new articles can be inserted between existing ones)
- **description**: A one-sentence summary of what the article covers
- **pinned**: Whether this article should be pinned to the top of the help page. Always set to \`false\` unless explicitly told otherwise.
- **category_description** (optional): A short description of the category, shown on the help page. Only include this on ONE article per category — whichever has the lowest order. Omit it from all other articles in the same category.

The frontmatter goes at the very top of the file. Do NOT add a H1 heading or introductory paragraph — the title and description are already in the frontmatter. Start the markdown content directly with H2 sections after the closing \`---\`.

## Documentation Guidelines
- Write for a NON-TECHNICAL audience. The readers are small business owners (dog walkers), not developers.
- Use simple, friendly language. Avoid jargon, technical terms, URLs, URL paths, API references, or internal identifiers.
- Guide users by describing what to CLICK and what they'll SEE, not where things are in the URL structure. For example say "Go to Settings, then click Pricing" NOT "Navigate to /manage/operators/{id}/pricing".
- Use the EXACT words and labels shown on screen. If a button says "Save", write "click **Save**" — don't paraphrase it as "persist your changes" or "save your configuration".
- Avoid UI jargon. Don't say "toggle", "dropdown", "modal", or "sidebar". Instead say "switch", "menu", "pop-up", "left-hand menu".
- Explain the WHY, not just the how. For example: "Set your base price — this is what customers will pay for a standard walk" is better than just "Set your base price".
- Warn clearly before anything destructive or irreversible. If clicking something deletes data or can't be undone, flag it.
- Do NOT use code formatting (backticks) for field names or values. Use **bold** instead.
- One action per step. "Click Settings, then click Pricing" should be two separate numbered steps, not one.
- Reference screenshots with: ![description](../screenshots/FILENAME)
- ALWAYS annotate screenshots with highlight_element before taking them. Every screenshot should have at least one highlighted element so the reader knows exactly what to look at. This is especially important for navigation screenshots — if you're telling the user to click something on a page (e.g. "click Pricing in Settings"), highlight that item before taking the screenshot. Only highlight elements that the user needs to interact with for the current step — do NOT highlight unrelated items just because they are nearby. Use numbered badges and reference them in the text, e.g. 'Click **Pricing** **(1)**'. Always call clear_highlights after taking the annotated screenshot.
- Before taking a screenshot, scroll to make sure the relevant content is visible in the viewport. If you need to show a specific element, scroll it into view first. If the page is long (like a calendar or settings page), consider using full_page mode to capture everything.
- Make sure the element you highlighted is actually visible in the screenshot. If you highlighted something and then scrolled, the highlight might be off-screen. Scroll back to it or re-highlight after scrolling.
- You can SEE each screenshot after taking it. Check that it looks correct — the right content is visible, annotations are in the right place, and nothing is cut off. If a screenshot is bad, clear highlights, scroll to fix the position, re-highlight, and take it again.
- Explain what each setting, option, or field does in plain English
- Note important caveats, tips, or prerequisites
- Use clear headings and logical structure
- Use sentence case for ALL headings and titles (e.g. "Setting up pricing" NOT "Setting Up Pricing"). Only capitalise the first word and proper nouns.
- NEVER describe current field values as "defaults". The account you are browsing is a shared test account — values you see may have been changed by previous runs or by other users. Describe what each field DOES and what options are available, but do NOT state specific values as defaults (e.g. say "Base price — the starting price for a booking" NOT "Base price (Default: £8.00)"). If the app itself labels something as a default, you may mention that.

## Important Rules
- You are ALREADY logged in — do NOT navigate to /login
- The app URL structure is https://muddybooking.com/manage/operators/{id}/... — but NEVER include raw URLs or paths in the documentation output. Always describe navigation in human terms ("click X in the sidebar").
- Take screenshots BEFORE documenting each view
- Keep screenshot labels short and descriptive
- Save knowledge about app structure you discover for future runs
- Be thorough — explore sub-pages and settings panels within the feature
- When you encounter dropdowns or expandable sections, interact with them to document all options
- You may interact with forms, make bookings, and submit data if needed to fully document a feature. For example, you might need to create a booking to document the booking flow, or submit a form to show what happens next. Use the test account freely — it exists for this purpose.
- When changing settings or filling in forms, always click the Save/Submit button to apply changes. Don't just enter values — make sure they're actually saved before moving on.
- When you need to enter an email address (e.g. sending a voucher, creating a customer), use one of these safe test emails: blackhole+1@muddybooking.com, blackhole+2@muddybooking.com, blackhole+3@muddybooking.com, blackhole+4@muddybooking.com, blackhole+5@muddybooking.com, blackhole+6@muddybooking.com, blackhole+7@muddybooking.com, blackhole+8@muddybooking.com, blackhole+9@muddybooking.com, blackhole+10@muddybooking.com. These go nowhere and are safe to use.`;
}

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  session: BrowserSession,
): Promise<string> {
  const { stagehand } = session;

  try {
    switch (name) {
      case "navigate_to_url": {
        const url = input.url as string;
        console.log(`  -> Navigating to: ${url}`);
        await session.page.goto(url);
        await waitForPage(session.page);
        const state = await getPageState(session.page);
        return `Navigated to ${state.url}. Page title: "${state.title}". Content preview: ${state.textContent.substring(0, 1000)}`;
      }

      case "click_element": {
        const desc = input.description as string;
        console.log(`  -> Clicking: ${desc}`);
        const pagesBefore = stagehand.context.pages().length;
        try {
          const actions = await stagehand.observe(`Click: ${desc}`);
          if (actions.length > 0) {
            await stagehand.act(actions[0]);
          } else {
            await stagehand.act(`Click ${desc}`);
          }
        } catch {
          // Fallback to direct act
          await stagehand.act(`Click ${desc}`);
        }
        // Auto-switch to new tab if one opened
        const pagesAfter = stagehand.context.pages();
        if (pagesAfter.length > pagesBefore) {
          session.page = pagesAfter[pagesAfter.length - 1];
          console.log(`  -> New tab opened, switched to tab ${pagesAfter.length - 1}`);
        }
        await waitForPage(session.page);
        const state = await getPageState(session.page);
        return `Clicked "${desc}". Current URL: ${state.url}. Page title: "${state.title}". Content preview: ${state.textContent.substring(0, 800)}`;
      }

      case "type_into_field": {
        const instruction = input.instruction as string;
        console.log(`  -> Typing: ${instruction}`);
        await stagehand.act(instruction);
        await sleep(500);
        return `Executed: ${instruction}`;
      }

      case "get_page_state": {
        const state = await getPageState(session.page);
        return `URL: ${state.url}\nTitle: ${state.title}\n\nVisible content:\n${state.textContent}`;
      }

      case "extract_data": {
        const instruction = input.instruction as string;
        console.log(`  -> Extracting: ${instruction}`);
        const result = await stagehand.extract(instruction);
        return JSON.stringify(result, null, 2);
      }

      case "list_page_links": {
        const links = await getPageLinks(session.page);
        if (links.length === 0) return "No links found on this page.";
        const formatted = links
          .map((l) => `- ${l.text}: ${l.href}`)
          .join("\n");
        return `Found ${links.length} links:\n${formatted}`;
      }

      case "take_screenshot": {
        const label = input.label as string;
        const fullPage = (input.full_page as boolean) || false;
        const filename = await takeScreenshot(session.page, label, fullPage);
        return `Screenshot saved: ${filename}. Reference it in markdown as: ![${label}](../screenshots/${filename})`;
      }

      case "scroll_page": {
        const direction = input.direction as "up" | "down";
        console.log(`  -> Scrolling ${direction}`);
        await scrollPage(session.page, direction);
        return `Scrolled ${direction}. Use get_page_state or take_screenshot to see the new view.`;
      }

      case "highlight_element": {
        const desc = input.description as string;
        const label = input.label as string;
        console.log(`  -> Highlighting: ${desc} [${label}]`);
        const result = await highlightElement(session, desc, label);
        return result;
      }

      case "clear_highlights": {
        await clearHighlights(session.page);
        console.log(`  -> Cleared highlights`);
        return "All highlights removed.";
      }

      case "list_tabs": {
        const pages = stagehand.context.pages();
        const tabs = await Promise.all(pages.map(async (p, i) => {
          const url = p.url();
          const title = await p.title();
          const active = p === session.page ? " (active)" : "";
          return `${i}: ${title} — ${url}${active}`;
        }));
        console.log(`  -> ${pages.length} tabs open`);
        return `Open tabs:\n${tabs.join("\n")}`;
      }

      case "switch_tab": {
        const tabIndex = input.tab_index as number;
        const pages = stagehand.context.pages();
        if (tabIndex < 0 || tabIndex >= pages.length) {
          return `Invalid tab index ${tabIndex}. There are ${pages.length} tabs open (0-${pages.length - 1}).`;
        }
        session.page = pages[tabIndex];
        const state = await getPageState(session.page);
        console.log(`  -> Switched to tab ${tabIndex}: ${state.url}`);
        return `Switched to tab ${tabIndex}. URL: ${state.url}. Title: "${state.title}". Content preview: ${state.textContent.substring(0, 800)}`;
      }

      case "read_knowledge": {
        const topic = input.topic as string;
        const content = readKnowledge(topic);
        if (!content) return `No knowledge file found for topic "${topic}".`;
        return content;
      }

      case "save_knowledge": {
        const topic = input.topic as string;
        const content = input.content as string;
        saveKnowledge(topic, content);
        console.log(`  -> Knowledge saved: ${topic}`);
        return `Knowledge saved to "${topic}".`;
      }

      case "list_knowledge_files": {
        const files = listKnowledgeFiles();
        if (files.length === 0) return "No knowledge files exist yet.";
        return `Knowledge files: ${files.join(", ")}`;
      }

      case "list_existing_docs": {
        if (!fs.existsSync(DOCS_DIR)) return "No documentation files exist yet.";
        const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".md"));
        if (files.length === 0) return "No documentation files exist yet.";
        const docs = files.map((f) => {
          const content = fs.readFileSync(path.join(DOCS_DIR, f), "utf-8");
          const titleMatch = content.match(/\ntitle:\s*(.+)/);
          const slugMatch = content.match(/\nslug:\s*(.+)/);
          const categoryMatch = content.match(/\ncategory:\s*(.+)/);
          return `- ${f} | title: "${titleMatch?.[1]?.trim() || "?"}" | slug: ${slugMatch?.[1]?.trim() || "?"} | category: ${categoryMatch?.[1]?.trim() || "?"}`;
        });
        return `Existing docs:\n${docs.join("\n")}`;
      }

      case "read_documentation": {
        const filename = input.filename as string;
        const filepath = path.join(DOCS_DIR, filename);
        if (!fs.existsSync(filepath)) {
          return `File not found: docs/${filename}`;
        }
        const content = fs.readFileSync(filepath, "utf-8");
        console.log(`  -> Read: ${filepath} (${content.length} chars)`);
        return content;
      }

      case "delete_documentation": {
        const filename = input.filename as string;
        const filepath = path.join(DOCS_DIR, filename);
        if (!fs.existsSync(filepath)) {
          return `File not found: docs/${filename}`;
        }
        fs.unlinkSync(filepath);
        console.log(`  -> Deleted: ${filepath}`);
        return `Deleted docs/${filename}. Old screenshots will be cleaned up automatically.`;
      }

      case "finish_documentation": {
        const filename = input.filename as string;
        const content = input.markdown_content as string;
        const filepath = path.join(DOCS_DIR, filename);
        fs.mkdirSync(DOCS_DIR, { recursive: true });
        fs.writeFileSync(filepath, content, "utf-8");
        console.log(`  -> Documentation written: ${filepath}`);

        // Extract title for use in PR/commit messages
        const titleMatch = content.match(/title:\s*(.+)/);
        if (titleMatch) {
          const docTitlePath = path.resolve(".doc-title");
          fs.writeFileSync(docTitlePath, titleMatch[1].trim(), "utf-8");
          console.log(`  -> Doc title written: "${titleMatch[1].trim()}" to ${docTitlePath}`);
        }

        return `Documentation saved to docs/${filename}`;
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`  -> Tool error (${name}): ${message}`);
    return `Error executing ${name}: ${message}`;
  }
}

export async function runOrchestrator(
  task: string,
  session: BrowserSession,
): Promise<string> {
  const client = new Anthropic();
  const knowledgeSummary = getKnowledgeSummary();
  const pageState = await getPageState(session.page);
  const existingCategories = getExistingCategories();
  if (existingCategories.length > 0) {
    console.log(`  Existing categories: ${existingCategories.join(", ")}`);
  }
  const existingTags = getExistingTags();
  if (existingTags.length > 0) {
    console.log(`  Existing tags: ${existingTags.join(", ")}`);
  }
  const systemPrompt = buildSystemPrompt(task, knowledgeSummary, existingCategories, existingTags);

  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content: `Your documentation task: "${task}"

You are currently on: ${pageState.url}
Page title: "${pageState.title}"

Begin by checking available knowledge files, then navigate to the relevant pages to explore and document this feature. Take screenshots as you go. When you have enough information, call finish_documentation to produce the final markdown output.`,
    },
  ];

  let outputFile = "";
  let softReminderSent = false;
  let finalReminderSent = false;

  for (let turn = 0; turn < HARD_TURN_LIMIT; turn++) {
    const turnNumber = turn + 1;
    console.log(`\n--- Orchestrator turn ${turnNumber}/${HARD_TURN_LIMIT} (soft limit ${SOFT_TURN_LIMIT}) ---`);

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16384,
      system: systemPrompt,
      tools,
      messages,
    });

    // Add assistant response to conversation
    messages.push({ role: "assistant", content: response.content });

    // Log any text blocks from Claude
    for (const block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        console.log(`  Claude: ${block.text.substring(0, 200)}`);
      }
    }

    // If no tool calls, we're done
    if (response.stop_reason === "end_turn") {
      console.log("  Orchestrator finished (end_turn).");
      break;
    }

    // Process tool calls
    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );

    if (toolUseBlocks.length === 0) {
      console.log("  No tool calls, finishing.");
      break;
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of toolUseBlocks) {
      console.log(`  Tool call: ${block.name}(${JSON.stringify(block.input).substring(0, 100)})`);
      const result = await executeTool(
        block.name,
        block.input as Record<string, unknown>,
        session,
      );
      if (block.name === "finish_documentation") {
        outputFile = result;
      }
      // For screenshots, include the image so the agent can see what it captured
      if (block.name === "take_screenshot" && !result.startsWith("Error")) {
        const filenameMatch = result.match(/Screenshot saved: (.+?)\./);
        if (filenameMatch) {
          const imgPath = path.join(SCREENSHOTS_DIR, filenameMatch[1]);
          if (fs.existsSync(imgPath)) {
            const imgData = fs.readFileSync(imgPath).toString("base64");
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: [
                { type: "text", text: result },
                { type: "image", source: { type: "base64", media_type: "image/png", data: imgData } },
              ],
            });
          } else {
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
          }
        } else {
          toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
        }
      } else {
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
    }

    // Build the user-message content: tool results, plus an optional budget-reminder
    // text block when we cross a threshold (sent once each).
    const userContent: Array<Anthropic.ToolResultBlockParam | Anthropic.TextBlockParam> = [...toolResults];

    if (!finalReminderSent && turnNumber >= FINAL_WARNING_TURN) {
      userContent.push({
        type: "text",
        text: `URGENT BUDGET REMINDER: You have used ${turnNumber}/${HARD_TURN_LIMIT} turns. The run will abort at ${HARD_TURN_LIMIT} with NO documentation produced. Call finish_documentation NOW with whatever you have. Do not take any more screenshots or extract any more data — write the doc with what you've already gathered.`,
      });
      finalReminderSent = true;
      console.log("  -> Sent FINAL budget reminder");
    } else if (!softReminderSent && turnNumber >= SOFT_TURN_LIMIT) {
      userContent.push({
        type: "text",
        text: `BUDGET REMINDER: You have used ${turnNumber}/${HARD_TURN_LIMIT} turns. You're past the ${SOFT_TURN_LIMIT}-turn target. Stop exploring nice-to-haves and start wrapping up. Call finish_documentation as soon as you have enough material for an accurate, useful doc.`,
      });
      softReminderSent = true;
      console.log("  -> Sent soft budget reminder");
    }

    messages.push({ role: "user", content: userContent });

    if (outputFile) {
      console.log("  Documentation generated, finishing.");
      break;
    }
  }

  if (!outputFile) {
    console.log(`  Hit hard turn limit (${HARD_TURN_LIMIT}) without finish_documentation.`);
  }

  return outputFile || "No documentation was generated.";
}
