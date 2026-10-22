# Muddy Booking Booking Rules Structure

## Updated Structure (as of October 2026)

Most booking rules are now set **per offering** (not globally).

### Offering-level booking rules
Path: Offerings > [offering name] > Settings

- **Maximum number of dogs** - per booking
- **Start booking slots at** - options: top of hour, quarter past, half past, quarter to, every 15 mins, every 30 mins
- **Future booking period** (days/hours/minutes) - how far ahead bookings can be made
- **Booking notice period** (days/hours/minutes) - minimum notice before a booking
- **Cancellation notice period** (days/hours/minutes) - minimum notice to cancel/reschedule
- **Buffer period** (days/hours/minutes) - transition time added after bookings
- (Also: Tax classification, Access instructions, Short access instructions - not booking rules)

URL: `/offerings/{id}/settings`

### Global Booking Settings (Settings > Booking settings)

Now only contains ONE setting:

- **Editing booking notice period** (days/hours/minutes) - how close to start a booking can be edited
  - Hint: "This can usually just be zero, to always allow edits"

URL: `/settings/booking`

### Settings page note
The Settings page now says: "You can manage nearly all of your settings from this panel, any others are set on each offering."
The Booking settings card says: "Manage how close to the start a booking can still be edited."
