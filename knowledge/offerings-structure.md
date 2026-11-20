# Muddy Booking Offerings Structure

## Overview
The Offerings page replaces the old "Walks" page in the left-hand menu. The URL is `/offerings`.

## Three-Part Structure
Offerings combine two things:
1. **Resources** (`/resources`) - what customers book time with (e.g. a field, a location, a groomer)
2. **Services** (`/services`) - the kinds of booking offered (e.g. private hire, puppy lesson)
3. **Offerings** (`/offerings`) - the combination of one service at one resource; each has its own prices, opening times and booking rules

## Resources Pages
- Resources list: `/resources`
- New resource: `/resources/new` - just requires a "Resource name"; button "Create my resource"
- Resource overview: `/resources/{id}` - shows stats, address, what3words, and list of offerings at that resource
- Resource settings: `/resources/{id}/settings`
- Resource menu (header "Settings" button): Settings ("Name, details and photo"), Block outs ("Close specific dates and times"), Advanced ("Resources that block slots here"), Delete resource

### Resource Settings Fields
- **Name** - what the resource is called (usually different from business name)
- **Address** - with map search; setting a location enables sunrise/sunset-anchored opening times
- **Location** - map marker, draggable
- **what3words** - precise location for customers
- **Description** (0/400 chars) - shown on customer-facing cards
- **Timezone** - defaults to the business timezone
- **Cover photo** - up to 10MB, inherits from business
- **Display noun** - what customers see when choosing a resource; inherits from business

Note: "Prices, opening times, booking rules and access instructions belong to each offering here, not to the resource itself. Edit them under Offerings."

## Services Pages
- Services list: `/services`
- New service: `/services/new` (list page button is "Create")
- Service overview: `/services/{id}` - shows stats, bookings, and "Offered at" summary
- Service settings: `/services/{id}/settings` (service page button is "Edit")

### Service Settings Fields
- **Name** - shown to customers when they choose a service
- **Cover photo** - up to 10MB, inherits from business
- **Description** (0/400 chars) - shown on customer-facing cards
- **Display verb** - e.g. "Walking"; inherits from business
- (Display subject was removed in v0.174.0)

## Offerings Pages
- Offerings list: `/offerings`
- New offering: `/offerings/new` - select resource and service (can create new ones inline)
- Offering overview: `/offerings/{id}` - status dot (Live/Upcoming/Inactive), stats, latest bookings, "New booking" button when bookable, Prices summary, Opening times summary, rules card (Slots start, shown as "{default}, varies by opening time" when a day or time range sets its own, Notice to book, Notice to cancel, Bookable up to, Buffer period, Tax classification). No maximum dogs.
- Warning when missing prices or opening times, with "Add prices" / "Set opening times" buttons; another when opening times use sunrise/sunset but the resource has no location ("Set a location")
- Offering menu (header "Settings" button): Settings ("Booking rules, tax and access instructions"), Opening times ("Set your regular availability"), Prices ("Durations, prices and questions"), Edit {resource} ("Name, details and photo"), Edit {service} ("Name, description and photo"), Remove offering
- Offering settings: `/offerings/{id}/settings`
- Offering Prices page: `/offerings/{id}/pricing` (menu item "Prices")
- Offering opening times: `/offerings/{id}/opening-times` (also holds "Start booking slots at")

### Offering Settings Fields (at /offerings/{id}/settings)
- **Future booking period** (days/hours/minutes) - how far ahead bookings can be made
- **Booking notice period** (days/hours/minutes) - minimum notice before a booking
- **Cancellation notice period** (days/hours/minutes) - minimum notice to cancel/reschedule
- **Buffer period** (days/hours/minutes) - transition time added after bookings
- **Tax classification** - None, VAT standard rate, VAT reduced rate, VAT exempt, VAT zero rated, Outside the scope of VAT
- **Access instructions** (rich text) - directions for customers; gate codes shown separately automatically
- **Short access instructions** (max 400 chars, no line breaks) - single sentence version

### Offering Prices (at /offerings/{id}/pricing)
The legacy pricing form (per-dog prices, commercial price, duration tabs) was retired in v0.174.0. The page is titled "Prices: {offering}" and has cards for Base prices ("Edit base prices"), Separate prices (only when a list or yes/no question exists) and Questions. See pricing-structure.md for detail. No maximum dogs setting; a count question's "At most" limits quantity. New businesses start with no questions.

### Offering Opening Times (at /offerings/{id}/opening-times)
- Tip about anchoring to sunrise/sunset/first light/last light, shown when the resource has no location
- **Apply preset to all days** - presets: 24/7, 05:00 to 22:00, 06:00 to 20:00, 06:00 to 22:00, 08:00 to 20:00, 09:00 to 17:00, 09:00 to 21:00, 10:00 to 16:00, Closed, Custom. When the resource has a location, also Sunrise to sunset, First light to last light
- Custom rows: Opens at / Closes at; with a location each can be anchored (fixed, sunrise, sunset, first light, last light) with an Offset in minutes
- Per day (Monday-Sunday): same presets as bulk apply

## Status
Each offering shows a status dot on its overview page: Live, Upcoming or Inactive.

## New Offering Flow
At `/offerings/new`:
- Select or create a Resource
- Select or create a Service
- If combination already exists, shows "Open it" link
- "Start it from": Start blank, Copy {other offering} (same service elsewhere, or other services at this resource), or "How it was before" when restoring a removed offering. A copy brings over prices, opening times, booking rules, buffer, tax classification and access instructions
- "Add" button to create ("Restore" when "How it was before" is chosen)
