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
const MAX_TURNS = 60;

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
      "Take a screenshot of the current page viewport. Returns the filename to use in documentation markdown.",
    input_schema: {
      type: "object" as const,
      properties: {
        label: {
          type: "string",
          description:
            'Short descriptive label, e.g. "pricing-page-overview"',
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
    name: "finish_documentation",
    description:
      "Write the final documentation markdown file and complete the task. The markdown_content MUST begin with YAML frontmatter (title, slug, category, tags, order, description). Call this when you have gathered enough information and are ready to produce the output.",
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

function buildSystemPrompt(task: string, knowledgeSummary: string, existingCategories: string[]): string {
  return `You are a documentation assistant for Muddy Booking (muddybooking.com), a booking management platform for dog walking businesses. You control a web browser that is already logged into the app.

## Your Task
"${task}"

## Existing Knowledge
${knowledgeSummary}

## Instructions
1. First, check existing knowledge files to understand the app structure (if any exist)
2. Navigate to the relevant pages — use the sidebar navigation or direct URLs
3. Take screenshots at key views to include in the documentation
4. Extract relevant data and content from pages
5. Save structural knowledge you discover (navigation links, URL patterns, settings layout) for future tasks
6. When you have enough information, call finish_documentation with comprehensive markdown

## Documentation Format
Every documentation file MUST begin with YAML frontmatter. Use this exact format:
\`\`\`
---
title: Setting up pricing
slug: setting-up-pricing
category: Getting started
tags:
  - pricing
  - walks
  - settings
order: 10
description: Learn how to configure base pricing, walk-specific pricing, and discounts.
---
\`\`\`
- **title**: A clear, human-readable title for the article
- **slug**: A URL-friendly version of the title (lowercase, hyphens, no special characters)
- **category**: A broad grouping. ${existingCategories.length > 0 ? `REUSE an existing category if it fits: ${existingCategories.map((c) => `"${c}"`).join(", ")}. Only create a new category if none of these are suitable.` : `Examples: "Getting started", "Settings", "Bookings", "Customers", "Calendar".`}
- **tags**: 2-5 relevant keywords for search and filtering
- **order**: A number for sorting within the category (10, 20, 30... — use multiples of 10 so new articles can be inserted between existing ones)
- **description**: A one-sentence summary of what the article covers

The frontmatter goes BEFORE the main heading. The markdown content follows after the closing \`---\`.

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
- ANNOTATE screenshots whenever a page has multiple fields or buttons to explain. Before taking a screenshot, use highlight_element to add numbered badges to the important elements, then reference those numbers in the text. For example: highlight "Base Price field" as "1", highlight "Save button" as "2", take screenshot, then write 'Enter your base price **(1)**, then click **Save** **(2)**'. Always call clear_highlights after taking the annotated screenshot.
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
- Do NOT fill in or submit forms. You are documenting the app, not using it. Screenshot forms as they are and describe what each field does. Do not type into inputs, select dates, or click submit/save buttons — just observe, extract, and screenshot.`;
}

async function executeTool(
  name: string,
  input: Record<string, unknown>,
  session: BrowserSession,
): Promise<string> {
  const { stagehand, page } = session;

  try {
    switch (name) {
      case "navigate_to_url": {
        const url = input.url as string;
        console.log(`  -> Navigating to: ${url}`);
        await page.goto(url);
        await waitForPage(page);
        const state = await getPageState(page);
        return `Navigated to ${state.url}. Page title: "${state.title}". Content preview: ${state.textContent.substring(0, 1000)}`;
      }

      case "click_element": {
        const desc = input.description as string;
        console.log(`  -> Clicking: ${desc}`);
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
        await waitForPage(page);
        const state = await getPageState(page);
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
        const state = await getPageState(page);
        return `URL: ${state.url}\nTitle: ${state.title}\n\nVisible content:\n${state.textContent}`;
      }

      case "extract_data": {
        const instruction = input.instruction as string;
        console.log(`  -> Extracting: ${instruction}`);
        const result = await stagehand.extract(instruction);
        return JSON.stringify(result, null, 2);
      }

      case "list_page_links": {
        const links = await getPageLinks(page);
        if (links.length === 0) return "No links found on this page.";
        const formatted = links
          .map((l) => `- ${l.text}: ${l.href}`)
          .join("\n");
        return `Found ${links.length} links:\n${formatted}`;
      }

      case "take_screenshot": {
        const label = input.label as string;
        const filename = await takeScreenshot(page, label);
        return `Screenshot saved: ${filename}. Reference it in markdown as: ![${label}](../screenshots/${filename})`;
      }

      case "scroll_page": {
        const direction = input.direction as "up" | "down";
        console.log(`  -> Scrolling ${direction}`);
        await scrollPage(page, direction);
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
        await clearHighlights(page);
        console.log(`  -> Cleared highlights`);
        return "All highlights removed.";
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

      case "finish_documentation": {
        const filename = input.filename as string;
        const content = input.markdown_content as string;
        const filepath = path.join(DOCS_DIR, filename);
        fs.mkdirSync(DOCS_DIR, { recursive: true });
        fs.writeFileSync(filepath, content, "utf-8");
        console.log(`  -> Documentation written: ${filepath}`);
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
  const systemPrompt = buildSystemPrompt(task, knowledgeSummary, existingCategories);

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

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    console.log(`\n--- Orchestrator turn ${turn + 1}/${MAX_TURNS} ---`);

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
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
      (b): b is Anthropic.ContentBlockParam & { type: "tool_use"; id: string; name: string; input: Record<string, unknown> } =>
        b.type === "tool_use",
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
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: result,
      });
    }

    messages.push({ role: "user", content: toolResults });

    if (outputFile) {
      console.log("  Documentation generated, finishing.");
      break;
    }
  }

  return outputFile || "No documentation was generated.";
}
