# Shop Orders Structure

Written by hand from the shop source code on 23 September 2026. Pages: `/manage/operators/{id}/shop/orders` and `/shop/orders/{sequence number}`.

## Orders list
- View switcher: "Awaiting fulfilment" (the default) and "All orders".
- Filters: "Order number", "Order" (Placed / Cancelled), "Payment", "Delivery".
- Columns: "Order", "Customer", "Total", "Payment", "Delivery".
- Checkouts that were never paid are hidden.
- Payment statuses: Unpaid, Paid, Partially paid, Refunded, Partially refunded, plus a "Payment pending" note.
- Delivery statuses: Nothing to dispatch, Awaiting dispatch, Awaiting collection, Ready to collect, Partly dispatched, Dispatched, Collected, Nothing more to send.

## Order page
- Main column: the items, "Price breakdown" (only when discounts apply), "Fulfilments", "Returns", "Transactions" (with "Record payment" and "Refund").
- Sidebar: "Total", "Balance", "Placed", "Cancel order", the "Contact" card, the customer, "Assign to customer" / "Assign to another customer", and "Send it to".

## Fulfilment (posted orders)
- "Record dispatch" opens the "Record a dispatch" pop-up. Fields:
  - "Carrier": Royal Mail, Parcelforce, Evri, DPD, DHL, UPS, FedEx, Yodel, Collected in person, Someone else.
  - "Tracking number", "Items" (with per-line quantities, so part of an order can be sent), "Notes".
  - "Send an email to the customer" (default on).
- Each dispatch row has "Send dispatch email" / "Resend dispatch email" and a bin icon (confirm "Remove it"). A dispatch can't be removed once the customer has been emailed.
- "Nothing more to send" closes the order with no money moving. "Reopen" undoes it.

## Collection orders
- "Ready to collect" opens a pop-up with the field "Where to come for it" and the button "Mark as ready". This always emails the customer.
  - For points with "Customers help themselves" on, the pop-up is titled "Left for the customer", the field is "Where to find it", and marking ready also records the handover.
- "Resend ready-to-collect email" (button "Resend email").
- "Customer has collected" (confirm "They have it") sends no email. "Send handover email" then sends one.
- On collection orders, "Record dispatch" is labelled "Record collection", and closing is labelled "Nothing more to hand over".

## Cancelling
- "Cancel order" (confirm "Cancel the order"). It is only available while nothing has been sent or collected and no payment is pending.
- Cancelling refunds everything paid, returns stock, emails the customer and revokes gift cards. It can't be undone.

## Returns and refunds
- "Record a return" pop-up:
  - "Reason for return", "Returned items", "Notes".
  - "Refund the customer for the returned items" (default off), "Refund delivery charge" (once per order).
  - "Put these back into stock" (default on).
  - Button: "Record return".
- Return row: "Refund" (with an editable "Amount", which allows a partial refund) and a bin icon (confirm "Remove it"). Removing a return does not reverse a refund or the stock.
- Refunds go to card, or back to a voucher. Offline payments trigger the "Manual refund required" email to staff.

## Customer emails
- "Your order {ref} is confirmed", "is on its way", "is ready to collect", "has been collected", "has been cancelled", and "Order {ref} - Refund processed".
