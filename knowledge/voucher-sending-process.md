# Voucher Sending Process

## Send Voucher Modal Fields
When clicking "Send voucher" on an individual voucher page (not shown for expired vouchers), a modal appears with:

1. **Recipient email** - Required (max 255). Pre-filled from the latest delivery, else the voucher's customer
2. **Recipient name** - Optional, personalises the greeting in the email. Pre-filled the same way
3. **Personal message** - Optional (max 2000 characters), shown above voucher details
4. **Schedule for later** - Toggle that reveals **Send at** (date and time in the business's time zone, must be in the future; defaults to one hour from now)
5. **Send voucher** button - Submits the form
6. **Cancel** button - Closes modal without sending

## After Sending
- Modal closes and returns to voucher page
- New entry appears in Deliveries section (columns Recipient, Status, Date):
  - Recipient email and name
  - Status: Pending, Sent or Failed
  - Date sent, or "Scheduled <date>" for scheduled sends
- Page refreshes itself every few seconds while an immediate send is pending
- Voucher remains Active and can be sent to additional recipients
- Backend rejects sends for expired vouchers ("Cannot send an expired voucher.")

## Scheduled Deliveries
- Pending scheduled deliveries can be clicked to open "Edit delivery" (same fields; button "Save changes", or "Send now" if Schedule for later is switched off)
- Bin icon cancels the delivery (confirm "Keep it" / "Cancel it")
