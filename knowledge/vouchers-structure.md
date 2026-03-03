# Muddy Booking Vouchers Structure

## Vouchers URLs and Navigation
- Main vouchers page: `/vouchers`
- Create voucher: `/vouchers/create`
- View/edit individual voucher: `/vouchers/{id}`
- Edit voucher: `/vouchers/{id}/edit`

## Voucher Creation Process
- Accessed via "Create voucher" button on main vouchers page
- Form fields:
  - Code: Text input with "Generate" button option
  - Initial balance: Currency amount (£)
  - Voucher expires: Toggle option that reveals expiry date field when enabled
  - Expiry date: Date input field (appears when expiry is enabled)

## Voucher Management Features
- Individual voucher pages show:
  - Code (partially masked with asterisks)
  - Balance
  - Status (ACTIVE, etc.)
  - Expiry date
  - Creation date
  - Transactions history
  - Deliveries history
- Available actions:
  - Edit voucher
  - Send voucher
  - Expire voucher
  - Record transaction

## Vouchers Overview Stats
- Redemption rate
- Total redeemed
- Expired unredeemed
- Average voucher value
- Filterable list of all vouchers with Code, Balance, Expires, Status, Created columns