# Muddy Booking Opening Times Structure

## URL and Navigation (checked v0.174.0)
- Opening times are set per offering only: `/offerings/{id}/opening-times`
- Access: Offerings > [offering] > Settings (header button) > Opening times ("Set your regular availability")
- Page header: "Opening times: {offering}"
- The old business-level page (`/opening-times`, Settings > Bookings > Opening times) was removed; the URL redirects. There is no "Inherit from business" option.

## Key Features
### Start booking slots at
- "Start booking slots at" card at the top: the offering's default. Options: Top of the hour, Quarter past the hour, Half past the hour, Quarter to the hour, Every fifteen minutes, Every thirty minutes
- Help text: "The times bookings can start at, for example 9:00, 9:15 or 9:30. A time range can set its own."
- Each open day (any preset except Closed and Custom) has its own "Start booking slots at" menu; on a Custom day each time row has one. First option "Default ({default})" uses the card's setting
- A slot starts in the range that holds its start time and can run on into a range that follows straight after, but never through closed time
- "Apply preset to all days" puts every day back on Default; changing one day's preset keeps that day's choice
- Moved here from offering Settings
- Recurring bookings: the start time must be allowed on every day the schedule runs (every day for a day-of-month schedule). Error: "{time} isn't a start time for {offering} on {days}."

### Preset System
- "Apply preset to all days" menu plus Apply button at the top
- Presets: 24/7, 05:00 to 22:00, 06:00 to 20:00, 06:00 to 22:00, 08:00 to 20:00, 09:00 to 17:00, 09:00 to 21:00, 10:00 to 16:00, Closed, Custom
- When the offering's resource has a location: also "Sunrise to sunset" and "First light to last light"

### Individual Day Settings
- Each day (Monday-Sunday) has the same preset options
- Custom shows time rows with "Opens at" / "Closes at"; with a resource location each can be anchored to sunrise, sunset, first light or last light with an "Offset" in minutes (negative = before)
- Rows can be removed with "Remove"

### Interface Elements
- Tip alert about sunrise/sunset anchoring when the resource has no location, with a "Set a location for {resource}" link
- Save button at bottom
- Errors appear if a change conflicts with recurring bookings
