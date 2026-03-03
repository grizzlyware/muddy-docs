# Muddy Booking Notification System Structure

## Main Notification URLs
- Notification settings: `/notification-configurations`
- SMS credits: `/notification-credits/sms`
- SMS auto top-up: `/notification-credits/sms/auto-renew`
- SMS usage history: `/notification-records/sms`
- WhatsApp credits: `/notification-credits/whatsapp`
- WhatsApp auto top-up: `/notification-credits/whatsapp/auto-renew`
- WhatsApp usage history: `/notification-records/whatsapp`

## Notification Types Available
The system can send notifications for:
- Booking cancelled
- Booking confirmed
- Booking reminder
- Customer login link
- Invoice cancelled
- Invoice issued
- Invoice paid
- Invoice payment reminder
- Invoice refunded
- Manual invoice send
- Waiting list availability alert

## Key Features
1. **Email notifications**: Included in plan (no additional cost)
2. **SMS notifications**: Require purchasing credits, UK mobile numbers only
3. **WhatsApp notifications**: Require purchasing credits, UK mobile numbers only
4. **Credit pricing**:
   - SMS: £5 for 50, £30 for 500, £50 for 1,000
   - WhatsApp: £5 for 50, £20 for 500, £30 for 1,000
5. **Auto top-up**: Available for both SMS and WhatsApp
6. **Credit expiry**: All credits expire 12 months after purchase
7. **Usage tracking**: Full history available for both SMS and WhatsApp messages