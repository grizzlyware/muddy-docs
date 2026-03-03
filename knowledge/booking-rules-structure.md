# Muddy Booking Booking Rules Structure

## URL and Navigation
- Main booking settings: `/settings/booking`
- Navigation: Settings > Bookings > Booking settings

## Available Settings

### Maximum Dogs Per Walk
- Field type: Number input
- Description: The maximum number of dogs that can be on a single booking
- Field shows current value (e.g., 20)

### Start Booking Slots At
- Field type: Dropdown/Select
- Description: The time that bookings can start at (e.g., 9am, 9:15am, 9:30am etc.)
- Options:
  - Top of the hour
  - Quarter past the hour
  - Half past the hour
  - Quarter to the hour
  - Every fifteen minutes
  - Every thirty minutes

### Future Booking Period
- Field type: Three separate inputs (Days, Hours, Minutes)
- Description: How far in the future can bookings be made?
- Controls how far in advance customers can book

### Booking Notice Period
- Field type: Three separate inputs (Days, Hours, Minutes)
- Description: How much notice do you need before a booking?
- Controls minimum advance booking time

### Editing Booking Notice Period
- Field type: Three separate inputs (Days, Hours, Minutes)
- Description: Up to what point before the booking can it be edited? (e.g., changing number of dogs)
- Note: "This can usually just be zero, to always allow edits"

### Buffer Period
- Field type: Three separate inputs (Days, Hours, Minutes)
- Description: The amount of time added to a booking's duration to act as a transition period
- Note: "This will only affect new bookings"

## Form Actions
- Save button at bottom of form