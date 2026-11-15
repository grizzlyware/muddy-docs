# Muddy Booking Vouchers Structure

## Vouchers URLs and Navigation
- Main vouchers page: `/vouchers`
- Create voucher: `/vouchers/create`
- View/edit individual voucher: `/vouchers/{id}`
- Edit voucher: `/vouchers/{id}/edit`

## Voucher Creation Process
- Accessed via "Create voucher" button on main vouchers page
- Form fields:
  - Code: Text input, pre-filled with a random 8-character code, with a "Generate" button (create only). Letters and numbers only (validated, max 255)
  - Customer: Optional customer search. If assigned, the voucher is auto-applied when that customer books while logged in (booking flow only, not shop)
  - Initial balance: Money input in the operator's currency, must be more than 0 (create only, not editable)
  - Voucher has a start date: Toggle that reveals "Valid from" date field
  - Voucher expires: Toggle that reveals "Expiry date" field. Pre-enabled with the default expiry date when Settings > Vouchers has "Enable voucher expiry" on. Expiry can't be in the past on create
- Submit button: "Create voucher" (or "Save changes" when editing)

## Voucher Management Features
- Individual voucher pages show:
  - Customer card (if assigned)
  - Code (masked, with copy to clipboard button)
  - Origin: Manual, Loyalty reward, Gift card order, Refund, Imported
  - Order link (gift card vouchers)
  - Balance
  - Status: Active, Not yet valid, Expired, Spent
  - Valid from ("Immediately" if none)
  - Expires ("Never" if none)
  - Created date
  - Deliveries and Transactions tables
  - Notes panel
- Available actions:
  - Record transaction (Type: Credit or Debit, Amount)
  - Edit voucher (code, customer, start date, expiry; not balance)
  - Send voucher (hidden when expired)
  - Expire voucher (hidden when expired; confirm "Keep it" / "Expire it"; sets expiry to now)

## Voucher Settings (Settings > Vouchers)
- Voucher refund policy: Refund to original voucher, Refund to new voucher
- Enable voucher expiry: toggle, reveals "Expiry period" (years and months, defaults to 6 months when switched on)
- Save button

## Vouchers Overview Stats
- Redemption rate
- Total redeemed
- Expired unredeemed
- Average voucher value
- Filters: Code, Customer, Status
- List columns: Code, Balance, Expires, Status, Created
