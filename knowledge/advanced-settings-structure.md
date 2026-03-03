# Muddy Booking Advanced Settings Structure

## URL and Location
- URL: `/settings/advanced`
- Access: Settings > Advanced settings (under Advanced section)

## Available Settings
1. **Legacy Stripe Secret Key** - Legacy key for refunds and past payment operations
2. **Mute notifications** - Toggle to prevent sending notifications to customers (used during migrations)
3. **Opening date** - Set a future date from which bookings will be accepted
   - Before this date: calendar unavailable, no booking slots generated
   - Leave empty if already open
   - Date format: YYYY-MM-DD (e.g., 2025-01-15)

## Opening Date Feature
- Purpose: Prevents bookings before a specified future date
- Effect: Calendar shows no available slots before the opening date
- Use case: For businesses not yet ready to accept bookings
- Setting appears to affect the booking calendar view immediately after saving