# Muddy Booking Block Outs Structure

## Block Outs Overview
Block outs are used to prevent bookings at specific times. Example use case: reserving time for maintenance activities like cutting grass.

## Navigation Access Points
1. **Main Navigation**: Direct link to `Block outs` in left sidebar
2. **Settings Page**: Under "Bookings" section - "Block outs" option (redirects to main block outs page)

## Main Block Outs Page
- Shows explanation: "Block outs are a way for you to prevent bookings at a particular time. For example, you might want to reserve some time to cut the grass!"
- Has a "Create" button to add new block outs
- Lists existing block outs in table format with columns:
  - Name
  - Starts 
  - Ends
  - Resources (previously called "Walks")
- Has "Filters" section
- Shows "No data available" when no block outs exist

## Create Block Out Form
Form fields include:
1. **Name** - Internal identifier for the block out (required)
   - Help text: "This is internal, and is used to identify the block out in the system."
2. **Description** - Optional notes for your records
   - Help text: "This is just for your own records."
3. **Starts at** - Date/time picker
   - Format: Shows @ symbol for time selection
   - Help text: "This is in the timezone of your business"
4. **Ends at** - Date/time picker  
   - Format: Shows @ symbol for time selection
   - Help text: "This is in the timezone of your business"
5. **Resources** (previously called "Walks") - Resource selection (shows available resources, e.g. "Hyde Park")
   - Help text: "Select the resources this block out applies to"

## Additional Features
- Conflict checking: Shows message "This block out doesn't conflict with any bookings"
- Submit button: "Create block out"

## Notes
- All times are shown in business timezone
- Resource selection appears to be multi-select based on help text
- The field was renamed from "Walks" to "Resources" (as of October 2026)
