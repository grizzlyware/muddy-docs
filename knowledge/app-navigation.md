# Muddy Booking App Navigation Structure

Checked against v0.174.0.

## Base URL Structure
- Management area base: `https://app.muddybooking.com/operators/{id}/`
- Current operator ID: 251

## Main Navigation Links (left-hand menu)
### Primary Sections
- Dashboard: `/` (operator base)
- Bookings: `/bookings`
- Customers: `/customers`
- Block outs: `/block-outs`
- Boards: `/bookings/boards`
- Calendar: `/calendar`
- Offerings: `/offerings` (replaced "Walks"; old `/walks/...` URLs redirect)
- Advisories: `/advisories`
- Marketing: `/marketing`

### Financial/Payment Sections
- Stripe setup: `/onboarding`
- Payouts: `/payouts`
- Invoices: `/invoices`
- Vouchers: `/vouchers`
- Loyalty points: `/loyalty-transactions`
- Shop: `/shop`

### Other
- Settings: `/settings`
- Gate codes: `/gate-codes`
- Subscription: `/subscription`
- Reports: `/reports`
- Import data: `/imports`

### Marketing URLs
- Marketing overview: `/marketing`
- Ask for reviews: `/marketing/automations/review_request`

### Pricing-Related URLs
- There is no business-level pricing page any more. `/pricing` redirects. Prices are per offering: `/offerings/{id}/pricing` (offering menu item "Prices", "Durations, prices and questions").
- Discounts: `/discounts` (new: `/discounts/new`)
- Surcharges: `/surcharges` (new: `/surcharges/new`)
- `/price-adjustments` only redirects to the above.

## Settings Page Structure
Intro: "You can manage nearly all of your settings from this panel, any others are set on each offering."
- Business: Business details, Stripe account, Branding, Website, Legal, Customer groups, Team management, Terminology
- Offerings: Offerings, Resources, Services
- Bookings: Booking settings, Customer sign-in, Recurring bookings, Cancellations & rescheduling, Block outs, Banned breeds, Loyalty programme
- Payments: Payment settings, Invoicing, Payment methods, Payment domains, Vouchers, Discounts, Surcharges
- Shop: Products, Options, Collections, Collection and delivery, Shop settings
- Notifications: Notification settings, SMS credits, WhatsApp credits
- Advanced: Website embedding, Advanced settings ("Notification muting and opening date.")

There is no Opening times item in Settings (opening times are per offering) and no Pricing section.
