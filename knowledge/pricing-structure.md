# Muddy Booking Pricing Structure

## Main Pricing Setup (/pricing)

### Basic Pricing Configuration
- **Duration-based pricing**: Each walk duration (e.g., "1 hour") has its own pricing configuration
- **Add duration**: Button to add additional walk durations
- **Commercial pricing toggle**: Option to set separate pricing for commercial bookings

### Pricing Fields (per duration)
1. **Base price** (£8.00 default)
   - Includes price for first N dogs (configurable)
   - Currency symbol: £

2. **Price per extra dog** (£1.00 default)  
   - Applied for each dog above the included number
   - Per-dog incremental pricing

3. **Extra dogs surcharge** (£0.00 default)
   - One-time surcharge applied when dogs exceed the included number
   - Flat fee in addition to per-dog pricing

4. **Total included dogs** (2 default)
   - Number of dogs included in the base price
   - Configurable value

5. **Prices include tax**
   - Toggle: Yes/No
   - Determines tax treatment

### Action Buttons
- **Save all pricing configurations**: Saves all duration/pricing settings
- **Delete this duration**: Removes a specific duration pricing block

## Price Adjustments (/price-adjustments)

### Types of Adjustments
- **Discounts**: Reduce booking prices
- **Surcharges**: Add to booking prices

### Discount/Surcharge Configuration
- **Name**: Internal identifier for the adjustment
- **Valid from/to**: Date range for availability
- **Type**: Percentage or fixed amount
- **Active status**: Enable/disable toggle
- **Auto-apply**: Automatic application to bookings
- **Original price basis**: Calculate on original vs. adjusted price

### Discount Codes
- Manual codes for customer use
- Generate button for automatic code creation
- Must be unique, letters and numbers only

### Discount Rules (Conditional Logic)
Available rule types for when adjustments apply:
- Must have no discounts/surcharges
- Start time before/after specific time
- Price above/below threshold  
- Specific walks (include/exclude)
- Booking group size limits
- Dog count limits
- Booking type (rescheduled, replacement)
- Customer group membership
- Light conditions (before/after first/last light)
- Date ranges
- Specific days of week

### Ordering
- Multiple adjustments can be ordered by priority
- Lower numbers applied first