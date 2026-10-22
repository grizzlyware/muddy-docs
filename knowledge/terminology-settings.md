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

## Business-level Custom Terminology Fields (as of October 2026)
Three main fields control the business-wide defaults:

1. **Resource display noun** - The word used to refer to resources throughout the app (e.g. "field", "park", "pool")
2. **Service display verb** - The word used to describe the action of attending a service (e.g. "walking", "attending", "training")
3. **Service display subject** - The word used to refer to the subject of a service (e.g. "dog", "horse", "client")

Note: The old field names were "Walk display noun", "Walk display verb", "Walk display subject". These have been renamed.

## Per-Resource Override
Each resource has its own **Display noun** field in its settings page (/resources/{id}/settings).
- "Inherited from your business, click to edit" label shown when using the business default
- Can be set independently per resource
- "Use default instead?" link appears when it has been customised

## Per-Service Override
Each service has its own **Display verb** and **Display subject** fields in its settings page (/services/{id}/settings).
- "Inherited from your business, click to edit" label shown when using business default
- "Use default instead?" link to revert to business default

## Live Example
The page includes a live example that updates in real-time as you change the terminology:
"You have a booking for our [noun] with 1 [subject] tomorrow, [verb] professionally or with friends."

## Functionality
- Users can apply presets using the dropdown and Apply button
- Users can enter custom values in the three text fields
- Changes are reflected immediately in the example text
- Must click Save button to persist changes
- Example shows exact phrasing that will appear throughout the app
