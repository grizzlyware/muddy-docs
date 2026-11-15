# Muddy Booking Terminology Settings

## URL and Location
- URL: `/settings/terminology`
- Navigation: Settings → Business → Terminology
- Page title: "Terminology settings"

## Feature Overview
The terminology settings allow users to customize the language used throughout the Muddy Booking app to match their specific business type. This affects all text in both the booking flow and management area.

## Available Preset Options
- Dog field
- Dog training
- Dog grooming  
- Equine arena hire

Applying a preset fills the fields and, once saved, also stores the preset. The stored preset chooses which booking questions are suggested on each offering's Prices page (Dog field: dogs count, professional dog walker yes/no, people count; Dog training: dogs count, dog age choice; Dog grooming: dogs by size count, coat choice, matted yes/no; Equine arena hire: horses count, jumps yes/no). With no preset saved, Dog field suggestions are used.

Preset words: Dog field leaves noun and verb at defaults; Dog training = Trainer / Attending; Dog grooming = Groomer / Attending; Equine arena hire = Arena / Riding.

## Business-level Custom Terminology Fields (as of v0.174.0)
Two fields control the business-wide defaults:

1. **Resource display noun** - The word used to refer to resources throughout the app (e.g. "field", "park", "pool")
2. **Service display verb** - The word used to describe the action of attending a service (e.g. "walking", "attending", "training")
The "Service display subject" field (and the per-service "Display subject") was removed in v0.174.0. There is no subject word any more; what is booked is described by booking questions instead.

Note: The old field names were "Walk display noun", "Walk display verb", "Walk display subject".

## Per-Resource Override
Each resource has its own **Display noun** field in its settings page (/resources/{id}/settings).
- "Inherited from your business, click to edit" label shown when using the business default
- Can be set independently per resource
- "Use default instead?" link appears when it has been customised

## Per-Service Override
Each service has its own **Display verb** field in its settings page (/services/{id}/settings).
- "Inherited from your business, click to edit" label shown when using business default
- "Use default instead?" link to revert to business default

## Live Example
The page includes a live example that updates in real-time as you change the terminology:
"You have a booking for our [noun] tomorrow, [verb] professionally or with friends."

## Functionality
- Users can apply presets using the dropdown and Apply button
- Users can enter custom values in the two text fields
- Changes are reflected immediately in the example text
- Must click Save button to persist changes
- Example shows exact phrasing that will appear throughout the app
