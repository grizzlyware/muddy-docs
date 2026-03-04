# Opening Date Settings Structure

## URL and Location
- Advanced Settings page: `/settings/advanced`
- Found under Settings > Advanced > Advanced settings
- Setting is labeled "Opening date" with explanation: "Set a future date from which you'll begin accepting bookings. Before this date, your calendar will be unavailable and no booking slots will be generated. Leave empty if you're already open."

## Functionality
- When opening date is set, dates before this date are disabled in the customer booking calendar
- The restriction applies across all months - entire months before the opening date are unavailable
- Dates from the opening date onwards are available for booking
- Setting accepts date format: YYYY-MM-DD (e.g., 2026-03-20)

## User Journey to Test
1. Set opening date in Settings > Advanced settings
2. Go to Walks > [Select a walk] > New booking
3. This opens customer booking interface at `/book/walk/{walk-id}`
4. Calendar shows disabled dates before opening date, enabled dates after

## Related Files
- Customer booking calendar interface shows the opening date restriction in action