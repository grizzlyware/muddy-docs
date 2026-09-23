# Shop Customer Journey Structure

Written by hand from the shop source code on 23 September 2026. The journey happens on the operator website: `https://{operator-slug}.muddybooking.com/shop`.

## Browsing
- Website menu link: "Shop". In the account menu: "Your orders".
- The shop front shows collections as sections with "View all N". Products outside a collection appear under "More products".
- Product cards show the price, or "From £X" when variants have different prices.
- Product page: option buttons. Unavailable options are greyed out with the tooltip "Out of stock" / "Not available with your other choices".
  - "Add to basket" becomes a quantity stepper once the product is in the basket.
  - After adding, a "View basket" button appears.

## Basket (`/shop/basket`)
- The header button reads "Basket (N)".
- "Order summary" panel: "Items", discount lines, "Subtotal" or "Total", "Delivery" ("At checkout" until an address is known), voucher lines, "Left to pay".
- "Discount or voucher code" box with the "Add" button and a "Check voucher balance" link.
- Apple Pay / Google Pay buttons (hidden once a voucher is on the order), then "— or —", then the "Checkout" button and the "Keep shopping" link.
- Limits: 999 of one item and 100 lines per basket. Each gift card is its own line.

## Checkout (`/shop/checkout/{order}`)
- "Your details": "First name", "Last name", "Email", "Phone". An "Already a customer? Sign in" link is shown. Guest checkout is allowed.
- If the operator offers both, the customer chooses between "Delivery" and "Collection" cards.
- "Delivery address": a "Delivery to someone else" checkbox, address lookup, and "Enter the address manually".
- Delivery options load after the address is filled in; a "Working out delivery costs…" message shows meanwhile.
- Policies: an "I accept the ..." checkbox, or the text "By continuing, you accept our ...".
- Button: "Continue to payment".

## Payment (`/shop/checkout/{order}/pay`)
- A Stripe card form.
- "Pay with vouchers" appears when vouchers cover the whole order.

## After payment
- Order page `/shop/orders/{order}`. Heading: "Thank you — your order has been placed".
  - Later headings: "Your order is on its way", "Your order is ready to collect".
  - Cards: "What you ordered", "Your parcels" / "Your collection", "Delivery address".
- "Your orders" (`/shop/orders`) requires sign-in and shows 10 orders per page.
