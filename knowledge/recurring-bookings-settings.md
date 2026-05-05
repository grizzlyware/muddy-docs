# Recurring Bookings Settings Structure

## URL and Location
- Main settings: `/settings/recurring-bookings`
- Located in Settings > Bookings > Recurring bookings

## Account-Level Settings
1. **Enable recurring bookings toggle** - Master switch to enable/disable the feature
2. **Materialisation cadence** - Radio buttons for Weekly or Monthly
3. **Day selector** - Changes based on cadence choice:
   - Weekly: Day of week (Monday through Sunday) 
   - Monthly: Day of month (1st, 10th, 15th, 25th, 28th - stops at 28th to avoid month-end edge cases)

## Help Text
- Weekly: "Bookings will be generated up to two weeks ahead, refreshed every week on this day"
- Monthly: "Bookings will be generated up to two months ahead, refreshed every month on this day"

## Key Concepts
- Materialisation cadence controls how often the platform generates bookings (account-wide setting)
- Weekly keeps roughly 2 weeks of bookings ready
- Monthly keeps roughly 2 months of bookings ready
- This is separate from the schedule frequency (how often customer's bookings happen)