# Walk Creation Process Structure

## Initial Walk Creation
- Access via Walks in main navigation
- Empty state shows "Setup my first walk" button
- Initial form only requires walk name
- Creates walk and redirects to styling page

## Walk Styling Page (/walks/{id}/booking-flow)
- Style booking calendar
- Cover image upload (up to 10MB)
- Color palette selection (affects all walks)
- Preview option available

## Walk Settings Menu Structure
After creation, walk has settings menu with:
- Settings (basic walk configuration)
- Style calendar (cover image and colors)  
- Opening times (walk-specific hours)
- Block outs (redirects to main block-outs)
- Pricing (walk-specific pricing setup)
- Advanced (walk dependencies/blocking)
- Delete walk

## Main Walk Settings Fields (/walks/{id}/settings)
1. Basic Information:
   - Name (walk display name)
   - Address (with search/map functionality)
   - what3words location
   
2. Access Information:
   - Access instructions (rich text)
   - Short access instructions (40 chars, single sentence)
   
3. Booking Configuration:
   - Maximum number of dogs
   - Start booking slots at (time intervals)
   - Buffer period (days/hours/minutes)
   
4. Display Settings:
   - Cover photo upload
   - Display noun (terminology)
   - Display verb (terminology) 
   - Display subject (terminology)

## Walk Overview Page
Shows walk statistics, bookings, revenue, and basic configuration summary including:
- Address status
- what3words status  
- Maximum dogs
- Booking slot intervals
- Notice periods
- Future booking period
- Buffer period