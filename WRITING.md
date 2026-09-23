# Writing help articles

This guide is for anyone writing a help article in `docs/`: a person, a Claude session, or the documentation generator (which is given this file word for word).

## Documentation Format
Every documentation file MUST begin with YAML frontmatter. Use this exact format:
```
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
```
- **title**: A clear, human-readable title for the article
- **category**: A broad grouping. REUSE an existing category if it fits. Only create a new category if none of the existing ones are suitable. The "Getting started" category is special — it is shown first on the website. Use it for topics a new user would need early on (e.g. initial setup, first bookings, key settings). Don't put every article in it — only ones relevant to someone just starting out.
- **tags**: 2-5 relevant keywords for search and filtering. REUSE existing tags where they fit. Only create a new tag if none of the existing ones are suitable.
- **order**: A number for sorting within the category (10, 20, 30... — use multiples of 10 so new articles can be inserted between existing ones)
- **description**: A one-sentence summary of what the article covers
- **pinned**: Whether this article should be pinned to the top of the help page. Always set to `false` unless explicitly told otherwise.
- **category_description** (optional): A short description of the category, shown on the help page. Only include this on ONE article per category — whichever has the lowest order. Omit it from all other articles in the same category.

The frontmatter goes at the very top of the file. Do NOT add a H1 heading or introductory paragraph — the title and description are already in the frontmatter. Start the markdown content directly with H2 sections after the closing `---`.

The filename (without `.md`) is the article's address on the help site, and the name other articles link to it by.

## Documentation Guidelines
- Write for a NON-TECHNICAL audience. The readers are small business owners (dog walkers), not developers.
- Use simple, friendly language. Avoid jargon, technical terms, URLs, URL paths, API references, or internal identifiers.
- Keep the tone human and helpful, not robotic or overly formal.
- Guide users by describing what to CLICK and what they'll SEE, not where things are in the URL structure. For example say "Go to Settings, then click Pricing" NOT "Navigate to /manage/operators/{id}/pricing".
- Use the EXACT words and labels shown on screen. If a button says "Save", write "click **Save**" — don't paraphrase it as "persist your changes" or "save your configuration".
- Avoid UI jargon. Don't say "toggle", "dropdown", "modal", or "sidebar". Instead say "switch", "menu", "pop-up", "left-hand menu".
- Explain the WHY, not just the how. For example: "Set your base price — this is what customers will pay for a standard walk" is better than just "Set your base price".
- Warn clearly before anything destructive or irreversible. If clicking something deletes data or can't be undone, flag it.
- Do NOT use code formatting (backticks) for field names or values. Use **bold** instead.
- One action per step. "Click Settings, then click Pricing" should be two separate numbered steps, not one.
- Reference screenshots with: ![description](../screenshots/FILENAME)
- When you mention something another article covers, link to that article so the reader can go straight there. Link by the article's filename, e.g. [Managing shop orders](managing-shop-orders.md), or [Limits](setting-up-shop-delivery.md#limits) for a heading in it. The help centre turns these into the right address. Never write a muddybooking.com/help address, because it breaks when an article moves category. Link to a heading in the same article with just the anchor, e.g. [Limits](#limits). A heading's anchor is the heading in lowercase, with spaces replaced by dashes and punctuation removed.
- Don't use tables. They don't render on the help site. Use bullet lists instead.
- Explain what each setting, option, or field does in plain English
- Note important caveats, tips, or prerequisites
- Use clear headings and logical structure
- Use sentence case for ALL headings and titles (e.g. "Setting up pricing" NOT "Setting Up Pricing"). Only capitalise the first word and proper nouns.
