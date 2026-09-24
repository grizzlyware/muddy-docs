# Muddy Booking Shop Structure (overview)

Written by hand from the shop source code on 23 September 2026, and checked again on 24 September 2026, before the shop went live.
Any environment you browse must run the shop code, or none of these pages will exist.
Check each label on screen before you quote it, because the shop was still changing when this was written.

Related knowledge files: shop-products-structure, shop-delivery-structure, shop-orders-structure, shop-discounts-structure, shop-checkout-structure.

## Navigation
- Left-hand menu: "Shop" (shopping basket icon), in the Payments group, after "Vouchers" and "Loyalty points" ("Loyalty points" shows only when a loyalty programme is on).
- Settings page also has a "Shop" section with links: "Products", "Options", "Collections", "Collection and delivery", "Shop settings".

## Management URLs (base `/manage/operators/{id}`)
- Shop landing page: `/shop`
- Orders: `/shop/orders`, single order: `/shop/orders/{sequence number}`
- Products: `/shop/products`, create: `/shop/products/new`, edit: `/shop/products/{id}`
- Product stock: `/shop/products/{id}/stock`
- Stock overview: `/shop/stock`
- Options: `/shop/options`, edit: `/shop/options/{id}`
- Collections: `/shop/collections`, create: `/shop/collections/new`, edit: `/shop/collections/{id}`
- Collection and delivery: `/shop/delivery`
- Shop settings: `/shop/settings`
- Setup review: `/shop/setup` (GET shows "Review your shop"; POST opens the shop). Only before setup is complete; otherwise it redirects to `/shop`.
- `?setup=1` puts `/shop/products/new`, `/shop/products/{id}` and `/shop/delivery` into setup mode. `/shop/products` is in setup mode whenever setup is incomplete.
- Discounts: `/discounts` (Settings > "Discounts"). Surcharges: `/surcharges`. On older builds, both lived at `/price-adjustments`.
- Preview the closed shop: `/site-preview?to=/shop` (used by the "Preview your shop" button).

## Customer-facing URLs (operator website, `https://{operator-slug}.muddybooking.com`)
- `/shop` (shop front), `/shop/collections/{id}`, `/shop/products/{id}`, `/shop/more-products`
- `/shop/basket`, `/shop/checkout/{order}`, `/shop/checkout/{order}/pay`
- `/shop/orders` (needs sign-in), `/shop/orders/{order}`
- When the shop is closed or the subscription has lapsed, every shop page returns 404, except a single order page.

## First-time setup (before the shop is first opened)
- Shown while `shop_setup_completed_at` is null. Opening the shop sets it, so an operator only sees setup once.
- `/shop` title: "Set up your shop". Description: "Add products, set up collection or delivery, then open your shop."
- No header button, figures or cards. A step bar shows "Products" (What you sell), "Collection or delivery" (How customers receive it) and "Review" (Check and open your shop). The middle step is dropped when no published product is physical.
- Checklist card:
  - "1. Add your first product" / "Start with a name and price." Button "Add a product" (`/shop/products/new?setup=1`). When done: "Products added", "N published product(s)", link "Review products".
  - "2. Set up collection or delivery" / "Add a collection point or a delivery method with a rate." Button "Set up collection or delivery", disabled until a product exists. When done: "Collection or delivery" with "Collection or delivery is set up." (link "Edit setup") or "Not needed for your current products."
  - "3. Review and open" / "Check everything before customers can buy." ("Next step: preview your shop and open it." when ready). Button "Review shop", disabled until ready.
- Ready means: at least one published, buyable product; and, if any is physical, an offered collection point or a delivery method with at least one rate.
- Product form in setup mode: "Save and continue" and "Back to setup". Saving goes to collection and delivery if still needed, otherwise to the review page.
- Products list in setup mode: step bar, "Back to setup" and "Continue".
- Collection and delivery in setup mode: step bar, "Back to setup" and "Review shop". "Places you don't deliver to" is hidden.
- Review page (`/shop/setup`): heading "Review your shop", "Preview your shop, then open it when you're ready." Rows "Products" and "Collection or delivery", each with "Change". Buttons "Back to setup", "Preview shop" (new tab) and "Open shop".
  - Confirm: "Open your shop? Anyone visiting your website will be able to see it and buy from it." with "Not yet" / "Open it". Success: "Your shop is open."

## Shop landing page (`/shop`, after setup)
- Title "Shop". Top-right button: "Preview your shop" when closed, "View your shop" when open. Both open a new tab.
- Figures: "Awaiting fulfilment", "Sales, last 30 days", "Products for sale".
- Cards: "Orders", "Products", "Stock", "Options", "Collections", "Collection and delivery", "Discounts", "Settings".
- Closed banner (yellow): "Your shop is closed. Customers can't buy from it." with the "Open shop" button.
- Open banner (green): "Your shop is open, and customers can buy from it." with the "Close shop" button.
- Open confirmation: "Open your shop? Customers will be able to see it and buy from it." with "Not yet" / "Open it". Close confirmation: "Keep it open" / "Close it".
- Delivery warning (only while the shop is open):
  - "You haven't set up collection or delivery, so customers can't order physical products." with the "Set up delivery" button. It can't be dismissed.
  - "You offer collection but no delivery..." with the "Dismiss" and "Set up delivery" buttons.

## Shop settings (`/shop/settings`)
- "Order number prefix": optional, max 10 characters. Letters, numbers, spaces and - / _ # are allowed. Blank means "#".
- "Example" box: "Your next order number will be ...".
- "Next order number": optional. Must be above the highest existing order number. It is used once, then numbering continues from there.
- Button: "Save". Success message: "Shop settings updated."

## Related settings
- Terms at checkout: Settings > "Legal" > "Require acceptance".
  - On: the checkout shows a required "I accept the ..." checkbox.
  - Off: the checkout shows the text "By continuing, you accept our ...".
- Staff notification: Profile > "Notification preferences" > "Shop order placed". Default on.

## Terminology traps
- "Collection" means two things: a group of products (Collections page), and picking an order up (a collection point delivery method).
- Surcharges never apply to shop orders. Discounts can apply to bookings, shop orders, or both.

## Safe test data
- Use the blackhole+N@muddybooking.com emails for checkout and gift card recipients.
- Opening the shop on a shared test account makes it public on that account's website. Close it again after the run if it was closed at the start.
