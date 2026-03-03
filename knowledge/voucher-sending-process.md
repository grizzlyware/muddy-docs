# Voucher Sending Process Details

## Send Voucher Modal Interface
- Accessed by clicking "Send voucher" button on individual voucher pages
- Modal contains:
  - "Email address" field for recipient
  - "Message" text area for custom message to customer
  - "Send" button to send the email
  - "Cancel" button to close modal

## Deliveries Tracking
- Individual voucher pages have a "Deliveries" section
- Shows: Recipient, Status, Date columns
- Tracks all sent voucher emails for that voucher
- Initially shows "No data available" until vouchers are sent

## Navigation to Vouchers
- Main vouchers list: `/vouchers`
- Individual voucher pages: `/vouchers/{id}`
- Available from sidebar navigation or Settings > Payments > Vouchers

## Send Process
1. Navigate to individual voucher page
2. Click "Send voucher" button
3. Fill in recipient email address
4. Add custom message (optional)
5. Click "Send" to email the voucher code to customer
6. Delivery is tracked in the Deliveries section

## Additional Settings
- Voucher settings page at `/settings/vouchers` contains general voucher policies
- Does not contain specific sending/delivery configurations