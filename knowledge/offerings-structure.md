# Muddy Booking Offerings Structure

## Overview
The Offerings page replaces the old "Walks" page in the left-hand menu. The URL is `/offerings`.

## Three-Part Structure
Offerings are built from two components:
1. **Resources** (`/resources`) - what customers book time with (e.g. a field, a location, a groomer)
2. **Services** (`/services`) - the kinds of booking offered (e.g. private hire, puppy lesson, group walk)
3. **Offerings** (`/offerings`) - the combination of one service at one resource; each has its own prices, opening times and booking rules

## Resources Pages
- Resources list: `/resources`
- New resource: `/resources/new` - just requires a name
- Resource overview: `/resources/{id}` - shows stats, address, what3words, and list of offerings at that resource
- Resource settings: `/resources/{id}/settings`

### Resource Settings Fields
- **Name** - what the resource is called (usually different from business name)
- **Address** - with map search; setting a location enables sunrise/sunset-anchored opening times
- **what3words** - precise location for customers
- **Description** (0/400 chars) - shown on customer-facing cards
- **Cover photo** - up to 10MB, inherits from business
- **Display noun** - what customers see when choosing a resource; inherits from business

Note: "Prices, opening times, booking rules and access instructions belong to each offering here, not to the resource itself. Edit them under Offerings."

## Services Pages
- Services list: `/services`
- New service: `/services/new`
- Service overview: `/services/{id}` - shows stats, bookings, and "Offered at" summary
- Service settings: `/services/{id}/settings`

### Service Settings Fields
- **Name** - shown to customers when they choose a service
- **Cover photo** - up to 10MB, inherits from business
- **Description** (0/400 chars) - shown on customer-facing cards
- **Display verb** - e.g. "Walking"; inherits from business
- **Display subject** - e.g. "Dog"; inherits from business

## Offerings Pages
- Offerings list: `/offerings`
- New offering: `/offerings/new` - select resource and service (can create new ones inline)
- Offering overview: `/offerings/{id}` - shows status (Active/Inactive), stats, price summary, opening times summary, booking rules summary
- Offering settings: `/offerings/{id}/settings`
- Offering pricing: `/offerings/{id}/pricing`
- Offering opening times: `/offerings/{id}/opening-times`

### Offering Settings Fields (at /offerings/{id}/settings)
- **Maximum number of dogs** - per booking
- **Start booking slots at** - options: top of hour, quarter past, half past, quarter to, every 15 mins, every 30 mins
- **Future booking period** (days/hours/minutes) - how far ahead bookings can be made
- **Booking notice period** (days/hours/minutes) - minimum notice before a booking
- **Cancellation notice period** (days/hours/minutes) - minimum notice to cancel/reschedule
- **Buffer period** (days/hours/minutes) - transition time added after bookings
- **Tax classification** - None, VAT standard rate, VAT reduced rate, VAT exempt, VAT zero rated, Outside the scope of VAT
- **Access instructions** (rich text) - directions for customers; gate codes shown separately automatically
- **Short access instructions** (max 400 chars, no line breaks) - single sentence version

### Offering Pricing (at /offerings/{id}/pricing)
- **Separate commercial price?** - if enabled, set different price for commercial bookings
- Duration tabs (e.g. "15 minutes") with **Add duration** button
- Per duration:
  - **Base price** - includes first dog
  - **Price per extra dog** - per dog above included count
  - **Extra dogs surcharge** - applied once if more than 1 dog
  - **Total included dogs** - number of dogs in the base price
  - **Prices include tax** (Yes/No)
- **Delete this duration** button

### Offering Opening Times (at /offerings/{id}/opening-times)
- Tip about anchoring to sunrise/sunset/first light/last light (requires resource address)
- **Apply preset to all days** - presets: 24/7, 05:00 to 22:00, 06:00 to 20:00, 06:00 to 22:00, 08:00 to 20:00, 09:00 to 17:00, 09:00 to 21:00, 10:00 to 16:00, Closed, Custom
- Per day (Monday-Sunday): same presets as bulk apply

## Status
Each offering shows as "Active" or "Inactive" on its overview page.

## New Offering Flow
At `/offerings/new`:
- Select or create a Resource
- Select or create a Service
- If combination already exists, shows "Open it" link
- "Add" button to create
