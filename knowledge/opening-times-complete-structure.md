# Complete Opening Times Structure

## Business Level Opening Times
- URL: `/opening-times`
- Access: Settings → Bookings → Opening times
- Description: "All of your walks will inherit these opening times. If you want to set different opening times for a specific walk, you can do so on the walk's settings."

### Features:
- Apply preset to all days functionality 
- Individual day settings for Monday-Sunday
- Available options: 24/7, multiple time ranges, Closed, Custom
- Custom option allows manual time entry
- Save button to commit changes

## Walk Level Opening Times  
- URL: `/walks/{id}/opening-times`
- Access: Walk page → Settings menu → Opening times
- Description: "These opening times will override any existing opening times set at the business level."

### Key Differences from Business Level:
- All same preset options PLUS "Inherit from business"
- "Inherit from business" allows walk to use business default times
- When walk has specific times set, they override business defaults
- Can mix inheritance with custom times per day

### Hierarchy:
1. Business level times = default for all walks
2. Walk level times = override business defaults when set
3. "Inherit from business" = revert to using business times for that day

## Available Time Presets:
- 24/7: Always available
- 05:00 to 22:00
- 06:00 to 20:00 
- 06:00 to 22:00
- 08:00 to 20:00
- 09:00 to 17:00
- 09:00 to 21:00
- 10:00 to 16:00
- Closed: Completely unavailable
- Custom: Manual time entry
- Inherit from business: (walk level only) Use business settings