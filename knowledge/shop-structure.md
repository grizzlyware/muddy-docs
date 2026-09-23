# Muddy Booking Shop Structure (overview)

Written by hand from the shop source code on 23 September 2026, before the shop went live.
Any environment you browse must run the shop code, or none of these pages will exist.
Check each label on screen before you quote it, because the shop was still changing when this was written.

Related knowledge files: shop-products-structure, shop-delivery-structure, shop-orders-structure, shop-discounts-structure, shop-checkout-structure.

## Navigation
- Left-hand menu: "Shop" (shopping basket icon), in the Payments group, after "Vouchers" and "Loyalty points".
- Settings page also has a "Shop" section with links: "Products", "Options", "Collections", "Delivery", "Shop settings".

## Management URLs (base `/manage/operators/{id}`)
- Shop landing page: `/shop`
- Orders: `/shop/orders`, single order: `/shop/orders/{sequence number}`
- Products: `/shop/products`, create: `/shop/products/new`, edit: `/shop/products/{id}`
- Product stock: `/shop/products/{id}/stock`
- Stock overview: `/shop/stock`
- Options: `/shop/options`, edit: `/shop/options/{id}`
- Collections: `/shop/collections`, create: `/shop/collections/new`, edit: `/shop/collections/{id}`
- Delivery: `/shop/delivery`
- Shop settings: `/shop/settings`
- Discounts: `/discounts` (Settings > "Discounts"). Surcharges: `/surcharges`. On older builds, both lived at `/price-adjustments`.
- Preview the closed shop: `/site-preview?to=/shop` (used by the "Preview your shop" button).

## Customer-facing URLs (operator website, `https://{operator-slug}.muddybooking.com`)
- `/shop` (shop front), `/shop/collections/{id}`, `/shop/products/{id}`, `/shop/more-products`
- `/shop/basket`, `/shop/checkout/{order}`, `/shop/checkout/{order}/pay`
- `/shop/orders` (needs sign-in), `/shop/orders/{order}`
- When the shop is closed or the subscription has lapsed, every shop page returns 404, except a single order page.

## Shop landing page (`/shop`)
- Title "Shop". Top-right button: "Preview your shop" when closed, "View your shop" when open. Both open a new tab.
- Figures: "Awaiting fulfilment", "Sales, last 30 days", "Products for sale".
- Cards: "Orders", "Products", "Stock", "Options", "Collections", "Delivery", "Discounts", "Settings".
- Closed banner (yellow): "Your shop is closed, so customers can't see it." It then gives one of three states:
  - "You have N product(s) ready to sell." with the "Open shop" button.
  - "...nobody can buy them until you set up delivery".
  - "Add a product with a price before you open it."
- Open banner (green): "Your shop is open, and customers can buy from it." with the "Close shop" button.
- Open confirmation: "Not yet" / "Open it". Close confirmation: "Keep it open" / "Close it".
- Delivery warning:
  - "You haven't set up delivery yet..." with the "Set up delivery" button. It can't be dismissed.
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
