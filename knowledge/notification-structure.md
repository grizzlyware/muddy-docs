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
Listed in Notification settings (auto-discovered from app/Notifications/FromOperator; "Invoice refunded" is legacy and hidden, "Review request" is configured under Marketing instead):
- Advisory to all customers
- Booking advisory
- Booking cancelled
- Booking confirmed
- Booking reminder (also has "Reminder intervals")
- Customer login link
- Invoice cancelled
- Invoice issued
- Invoice paid
- Invoice payment reminder
- Loyalty reward issued
- Manual invoice send
- Recurring booking cancelled
- Recurring bookings scheduled
- Refund processed
- Unpaid booking auto-cancelled
- Unpaid booking reminder
- Waiting list availability alert

## Edit Notification Form
- "Emails enabled?", "WhatsApp enabled?", "SMS enabled?" switches
- "SMS text" with variable buttons and an "SMS preview" (shown when SMS is on)
- "Save changes" button

## Key Features
1. **Email notifications**: Included in plan (no additional cost)
2. **SMS notifications**: Require purchasing credits, UK mobile numbers only. Credits per message come from the SMS provider (longer messages use more)
3. **WhatsApp notifications**: Require purchasing credits, UK mobile numbers only. Utility templates cost 1 credit, marketing templates (Loyalty reward issued, Review request, Advisory to all customers) cost 3 (TemplateCategory::getCreditMultiplier)
4. **Delivery order**: If WhatsApp is enabled it is tried first; SMS is only sent if WhatsApp fails (and not when a recipient has stopped marketing messages)
5. **Credit pricing**: Packages and prices come from Stripe products, not the codebase, so they can't be checked against the code. Last noted: SMS £5 for 50, £30 for 500, £50 for 1,000. WhatsApp £5 for 50, £20 for 500, £30 for 1,000. Prices shown excluding VAT by default, with an "Include VAT" switch
6. **Auto top-up**: Available for both SMS and WhatsApp. Fields: Enable auto top-up, Credit package, Renewal threshold, Enable spend cap, Spend cap (max credits per month)
7. **Credit expiry**: All credits expire 12 months after purchase (NotificationCreditService::CREDIT_EXPIRY_MONTHS)
8. **Usage tracking**: "View usage" page with Date, Customer, Notification, Credits, Booking columns
