# Shop Discounts Structure

Written by hand from the shop source code on 23 September 2026, and checked again on 24 September 2026.
Page: `/manage/operators/{id}/discounts` (Settings > "Discounts"). Create with the "Create" button (`/discounts/new`).

## Form fields (in order)
- "Where can this discount be used?": "Bookings", "Shop orders", or "Bookings and shop orders".
- "Discount name", "Discount valid from", "Should the discount run indefinitely?" ("Run indefinitely" / "Set end date"), "End date".
- "Discount type": "Percentage" or "Fixed amount". The amount goes in "Discount amount" or "Discount percentage".
- "Is this discount active?", "Apply automatically", "Apply to original price?" (percentage only).
- "Discount codes" (only when not automatic): "Add new code", with the buttons "Add" and "Generate".
- Shop orders section:
  - "What does this discount apply to?": "Goods" or "Delivery".
  - "Which goods does it apply to?": "All goods" or "Chosen items only". "Chosen items only" shows a collections and products picker.
  - "Include gift cards".
  - "Shop rules".
- "Adjustment ordering" (lower numbers apply first), "Maximum uses".
- Button: "Create discount" / "Save changes".

## Shop rules
- Goods total is at or above
- Goods total is at or below
- Order contains one of these products
- Order contains one of these variants
- Order contains a product from one of these collections
- Order contains a physical product

## Behaviour
- Surcharges never apply to shop orders.
- Discounts stack. All qualifying automatic discounts apply, plus every entered code.
- Goods discounts apply before delivery discounts.
- A fixed amount is capped at the total of the lines it applies to.
- Customers enter codes in the "Discount or voucher code" box in the basket or at checkout.
