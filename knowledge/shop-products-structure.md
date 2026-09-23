# Shop Products, Options, Collections, Stock and Gift Cards

Written by hand from the shop source code on 23 September 2026. Paths are relative to `/manage/operators/{id}`.

## Products list (`/shop/products`)
- "Create" button. There is also a collection filter ("All collections"), shown only when collections exist.
- Columns: "Name" (with a "Draft" badge when unpublished) and "Stock".
- "View in shop" opens the product through staff preview. It works for drafts and for a closed shop.

## Product form (`/shop/products/new`, `/shop/products/{id}`)
- "Product type": "Standard product" or "Gift card". Shown on create only; it can't be changed later.
- "Product name" (or "Gift card name"), "Description" (markdown).
- "Variants": "Just one variant" or "It comes in different variants".
- "Published" (default on), "Physical product" (default on).
- "Images": the first image has a "Primary" badge. Arrow buttons reorder the images.
- "SKU": becomes "SKU prefix" when the product has variants. A value is suggested from the name. Must be unique.
- "Price", "Tax classification" (None, VAT standard rate, VAT reduced rate, VAT exempt, VAT zero rated, Outside the scope of VAT).
- "Prices include tax": shown only when the product is taxed.
- "Weight (grams)": shown only when "Physical product" is on.
- Buttons: "Create product" / "Create gift card" / "Save changes" / "Delete product" (confirm "Delete it").
- Deleting a product is permanent. Past orders keep a copy of the product's details.

## Options and variants
- "Options": "Option name" and "Values", with "Add" and "Add another option". Max 3 options and max 100 variants.
- "Variants" table: columns "Variant", "SKU", "Price", "Sold", plus a settings icon per variant.
  - The settings icon opens: "Price", "Tax classification", "Weight (grams)", "SKU". Button: "Apply".
  - A price set on a variant shows "custom".
  - The "Sold" checkbox untick stops the variant selling. At least one variant must stay ticked.
- Options page (`/shop/options`): columns "Name", "Values", "Used by".
  - Renaming an option or value here renames it on every product.
  - Values can't be added here.
  - A value marked "In use" can't be removed.
  - Save button: "Save changes". "Delete option" appears only when no product uses the option.

## Collections (`/shop/collections`)
- "Create" button. Form: "Collection name" and "Cover image". Button: "Create collection".
- Cards: drag a card's handle to reorder collections, and drag products within a card to reorder them.
  - "Add products" opens a picker with confirm button "Add products". An X removes a product from the collection.
  - The pencil icon opens the edit page, with "Delete collection" (confirm "Delete it").
- "Not in a collection" panel: each product has an "Add to a collection" link.
- The shop front shows 4 products per collection with "View all N". Products not in a collection appear under "More products". Empty collections are hidden.

## Stock (`/shop/stock`, `/shop/products/{id}/stock`)
- Stock page: "Product or SKU" search. The "Show variants no longer for sale" switch reveals retired variants.
- Per-variant buttons: "Set stock" (untracked) or "Change stock" (tracked), and "Stop tracking".
  - "Set stock" pop-up: "Current quantity".
  - "Change stock" pop-up: "What changed?" ("Add stock" / "Remove stock"), "Quantity", "Note (optional)", and the "Save change" button.
- Product stock page: "Stock levels" and "Stock history".
  - History reasons: Starting quantity, Changed by staff, Customer order, Customer return, Order changed, Order cancelled, Stopped tracking.
- Stock is taken when an order is paid, not reserved while items sit in a basket. An oversell makes stock negative, and staff get the email "Not enough stock to fulfil order".
- Customers see "N in stock" (capped at "10+ in stock") or "Out of stock".

## Gift cards
- Create a product with "Product type" set to "Gift card". A gift card has no SKU, weight or stock.
- "Gift card values": "One value" ("Gift card value") or "Multiple values" ("Denomination 1..." and "Add denomination", minimum 2).
- "Gift card expires" switch with "Expires after" (months or years). It defaults to the voucher expiry in Settings > Vouchers.
- Artwork is generated automatically when no images are added.
- Customer fields: "Who is it for?" is "For me" or "Send to someone else".
  - "Send to someone else" asks for "Recipient name", "Recipient email" and "Personal message".
  - "Send it later" asks for a "Send date and time", at most 6 months ahead.
- After payment, a voucher with a "GFT..." code is created and emailed.
- Voucher credit can't pay for an order that contains a gift card.
