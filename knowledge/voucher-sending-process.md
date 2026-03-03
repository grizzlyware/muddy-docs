# Voucher Sending Process

## Send Voucher Modal Fields
When clicking "Send voucher" on an individual voucher page, a modal appears with:

1. **Recipient email** - Required field for the email address where the voucher will be sent
2. **Recipient name** - Optional field that personalizes the greeting in the email
3. **Personal message** - Optional field for adding a custom message above voucher details
4. **Schedule for later** - Option to send at a specific date/time instead of immediately
5. **Send voucher** button - Submits the form
6. **Cancel** button - Closes modal without sending

## After Sending
- Modal closes and returns to voucher page
- New entry appears in Deliveries section showing:
  - Recipient email and name
  - Status (PENDING initially)
  - Date sent
- Voucher remains ACTIVE and can be sent to additional recipients

## Modal Behavior
- Modal appears at top of page after clicking "Send voucher"
- Form validation requires email address
- Successful submission shows immediate feedback in Deliveries section