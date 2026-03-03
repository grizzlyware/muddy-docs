# Muddy Booking Cancellation Policy Structure

## URL and Location
- **Settings Path**: Settings > Bookings > Cancellations & rescheduling
- **Direct URL**: `/settings/cancellations`

## Configuration Options

### Notice Period Settings
- **Days**: Numeric input for days of notice
- **Hours**: Numeric input for hours of notice  
- **Minutes**: Numeric input for minutes of notice
- Help text: "How much notice do you need before a booking can be cancelled or rescheduled by the customer?"

### Standard Cancellation Fees (with sufficient notice)
- **Cancellation fee**: Fixed amount in currency (£)
  - Help: "A fixed fee charged when a booking is cancelled or rescheduled with sufficient notice. Set to 0 for no fixed fee."
- **Cancellation fee percentage**: Percentage of booking price
  - Help: "The percentage of the booking price to charge when cancelled or rescheduled with sufficient notice. Set to 0% for no percentage fee."

### Late Cancellation Settings
- **Allow late cancellations and reschedules**: Toggle switch
  - Help: "Allow customers to cancel or reschedule bookings within the notice period, subject to a fee."
  - When enabled, reveals late cancellation fee options

#### Late Cancellation Fees (within notice period)
- **Late cancellation fee**: Fixed amount in currency (£)
  - Help: "A fixed fee charged when a booking is cancelled or rescheduled within the notice period. Set to 0 for no fixed fee."
- **Late cancellation fee percentage**: Percentage of booking price
  - Help: "The percentage of the booking price to charge when cancelled or rescheduled within the notice period. Set to 100% to charge the full booking price."

### Tax Settings
- **Fees include tax**: Toggle switch
  - Help: "If enabled, the fixed fee amounts you enter are inclusive of tax."

### Important Notes
- "Cancellation fees will never exceed the original booking price."
- Both fixed amount and percentage fees can be combined
- Standard fees apply when sufficient notice is given
- Late fees apply when cancelling within the notice period (if enabled)
- Late cancellation option must be explicitly enabled to allow within-notice-period cancellations