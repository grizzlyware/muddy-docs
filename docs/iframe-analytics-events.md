---
title: Analytics events for embedded booking forms
category: Website embedding
tags:
  - embedding
  - analytics
  - events
  - website
order: 40
description: Track booking conversions and customer actions with automatic analytics events from your embedded Muddy booking form.
pinned: false
---

## What are analytics events?

When you embed your Muddy booking form on your website, it automatically fires analytics events when customers complete important actions like confirming, rescheduling, or cancelling bookings. These events help you track conversions and understand customer behavior without any additional setup.

The events work with any analytics platform including Google Analytics 4, Google Tag Manager, Meta/Facebook Pixel, and custom tracking solutions. No extra installation is required beyond your existing Muddy embed code.

## Available events

All events are automatically fired on your website's window when customers interact with the embedded booking form:

| Event name | When it fires | Payload summary |
|------------|---------------|----------------|
| [muddy.booking:ready](#ready-event) | When the booking form loads | Empty - signals form is ready |
| [muddy.booking:viewport](#viewport-event) | When form switches between mobile/desktop view | Device type information |
| [muddy.booking:confirmed](#confirmed-event) | When a booking is successfully confirmed | Complete booking and pricing data |
| [muddy.booking:rescheduled](#rescheduled-event) | When a booking is successfully rescheduled | Updated booking and pricing data |
| [muddy.booking:cancelled](#cancelled-event) | When a booking is cancelled | Original booking and pricing data |

## Ready event

Fires once when the embedded booking form has fully loaded and is ready to use.

```typescript
interface ReadyEventDetail {
  // Empty object
}
```

```javascript
window.addEventListener('muddy.booking:ready', function(event) {
  console.log('Muddy booking form is ready');
  // Good time to mark page view or show dependent UI
});
```

## Viewport event

Fires when the embedded form transitions between mobile and desktop layouts. Also fires once when the form first loads.

```typescript
interface ViewportEventDetail {
  isMobile: boolean;
}
```

```javascript
window.addEventListener('muddy.booking:viewport', function(event) {
  console.log('Viewport changed:', event.detail.isMobile);
});
```

## Confirmed event

Fires when a customer successfully confirms a new booking. This is your main conversion event.

```typescript
interface ConfirmedEventDetail {
  id: number;
  reference: string;
  slot: {
    id: string;
    signed_id: string;
    start: {
      iso: string;
      // ... other localized date fields
    };
    end: {
      iso: string;
      // ... other localized date fields  
    };
    vanity_end: {
      iso: string;
      // ... other localized date fields
    };
    duration: {
      // ... duration fields
    };
    vanity_duration: {
      // ... duration fields
    };
    is_past: boolean;
    is_future: boolean;
    is_happening_now: boolean;
    has_slots: {
      id: number | string;
      label: string;
      type: string;
      operator_id: number;
    };
  };
  price: {
    total: {
      amount: number; // Minor units (pence/cents)
      currency: string;
      is_zero: boolean;
      is_positive: boolean;
      formatted: {
        full: string; // e.g. "£25.00"
        // ... other formatted versions
      };
    };
    sub_total: {
      // ... same structure as total
    };
    tax: {
      // ... same structure as total
    };
  };
}
```

```javascript
window.addEventListener('muddy.booking:confirmed', function(event) {
  const booking = event.detail;
  console.log('Booking confirmed:', booking.reference);
  console.log('Total amount:', booking.price.total.amount / 100); // Convert to major units
});
```

## Rescheduled event

Fires when a customer successfully reschedules an existing booking. Has the same data structure as the confirmed event.

```typescript
interface RescheduledEventDetail {
  // Same structure as ConfirmedEventDetail
}
```

```javascript
window.addEventListener('muddy.booking:rescheduled', function(event) {
  const booking = event.detail;
  console.log('Booking rescheduled:', booking.reference);
});
```

## Cancelled event

Fires when a customer cancels their booking. Has the same data structure as the confirmed event.

```typescript
interface CancelledEventDetail {
  // Same structure as ConfirmedEventDetail
}
```

```javascript
window.addEventListener('muddy.booking:cancelled', function(event) {
  const booking = event.detail;
  console.log('Booking cancelled:', booking.reference);
});
```

## Analytics platform examples

### Vanilla JavaScript

Track all booking events with basic analytics:

```javascript
// Track booking confirmation
window.addEventListener('muddy.booking:confirmed', function(event) {
  const booking = event.detail;
  
  // Send to your analytics
  analytics.track('Booking Confirmed', {
    booking_id: booking.reference,
    service_name: booking.slot.has_slots.label,
    revenue: booking.price.total.amount / 100,
    currency: booking.price.total.currency
  });
});

// Track cancellations
window.addEventListener('muddy.booking:cancelled', function(event) {
  const booking = event.detail;
  
  analytics.track('Booking Cancelled', {
    booking_id: booking.reference,
    refund_amount: booking.price.total.amount / 100
  });
});

// Track rescheduling
window.addEventListener('muddy.booking:rescheduled', function(event) {
  const booking = event.detail;
  
  analytics.track('Booking Rescheduled', {
    booking_id: booking.reference,
    service_name: booking.slot.has_slots.label
  });
});
```

### Google Analytics 4 via gtag.js

Track purchases, refunds, and custom events:

```javascript
// Track booking confirmation as purchase
window.addEventListener('muddy.booking:confirmed', function(event) {
  const booking = event.detail;
  
  gtag('event', 'purchase', {
    transaction_id: booking.reference,
    value: booking.price.total.amount / 100, // Convert to major units
    currency: booking.price.total.currency,
    items: [{
      item_id: booking.slot.has_slots.id,
      item_name: booking.slot.has_slots.label,
      category: booking.slot.has_slots.type,
      price: booking.price.total.amount / 100,
      quantity: 1
    }]
  });
});

// Track cancellation as refund
window.addEventListener('muddy.booking:cancelled', function(event) {
  const booking = event.detail;
  
  gtag('event', 'refund', {
    transaction_id: booking.reference,
    value: booking.price.total.amount / 100,
    currency: booking.price.total.currency
  });
});

// Track rescheduling as custom event
window.addEventListener('muddy.booking:rescheduled', function(event) {
  const booking = event.detail;
  
  gtag('event', 'booking_rescheduled', {
    booking_reference: booking.reference,
    service_name: booking.slot.has_slots.label
  });
});
```

### Google Tag Manager via dataLayer

Push events to dataLayer for GTM triggers:

```javascript
// Handle all booking events
window.addEventListener('muddy.booking:confirmed', function(event) {
  const booking = event.detail;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'muddy_booking_confirmed',
    booking_reference: booking.reference,
    booking_id: booking.id,
    service_name: booking.slot.has_slots.label,
    service_type: booking.slot.has_slots.type,
    total_amount: booking.price.total.amount / 100,
    currency: booking.price.total.currency,
    start_time: booking.slot.start.iso
  });
});

window.addEventListener('muddy.booking:cancelled', function(event) {
  const booking = event.detail;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'muddy_booking_cancelled',
    booking_reference: booking.reference,
    booking_id: booking.id,
    refund_amount: booking.price.total.amount / 100,
    currency: booking.price.total.currency
  });
});

window.addEventListener('muddy.booking:rescheduled', function(event) {
  const booking = event.detail;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'muddy_booking_rescheduled',
    booking_reference: booking.reference,
    booking_id: booking.id,
    service_name: booking.slot.has_slots.label
  });
});
```

#### GTM setup

To use these events in Google Tag Manager:

1. **Create Custom Event triggers** with event names like `muddy_booking_confirmed`, `muddy_booking_cancelled`, and `muddy_booking_rescheduled`

2. **Create DataLayer Variables** for the booking data:
   - `booking_reference` (Data Layer Variable)
   - `booking_id` (Data Layer Variable)
   - `total_amount` (Data Layer Variable)
   - `currency` (Data Layer Variable)

3. **Wire into GA4 Event tags** using these triggers and variables to send purchase/refund events to Google Analytics

### Meta/Facebook Pixel

Track booking confirmations as purchases:

```javascript
window.addEventListener('muddy.booking:confirmed', function(event) {
  const booking = event.detail;
  
  fbq('track', 'Purchase', {
    value: booking.price.total.amount / 100,
    currency: booking.price.total.currency,
    content_name: booking.slot.has_slots.label,
    content_type: 'service',
    content_ids: [booking.slot.has_slots.id]
  });
});

window.addEventListener('muddy.booking:cancelled', function(event) {
  const booking = event.detail;
  
  fbq('trackCustom', 'BookingCancelled', {
    booking_reference: booking.reference,
    refund_value: booking.price.total.amount / 100,
    currency: booking.price.total.currency
  });
});
```

### PostHog/Segment/Mixpanel

Forward events to any analytics platform with a `track()` API:

```javascript
window.addEventListener('muddy.booking:confirmed', function(event) {
  const booking = event.detail;
  
  // PostHog
  posthog.capture('Booking Confirmed', {
    booking_reference: booking.reference,
    service_name: booking.slot.has_slots.label,
    revenue: booking.price.total.amount / 100
  });
  
  // Segment
  analytics.track('Booking Confirmed', {
    booking_reference: booking.reference,
    service_name: booking.slot.has_slots.label,
    revenue: booking.price.total.amount / 100
  });
  
  // Mixpanel
  mixpanel.track('Booking Confirmed', {
    booking_reference: booking.reference,
    service_name: booking.slot.has_slots.label,
    revenue: booking.price.total.amount / 100
  });
});
```

## Troubleshooting

### Event doesn't fire

Make sure the Muddy embed script is properly installed on your page, and that your event listener is attached to the `window` object, not the iframe element itself.

```javascript
// Correct - listen on window
window.addEventListener('muddy.booking:confirmed', handler);

// Wrong - don't listen on iframe
document.querySelector('iframe').addEventListener('muddy.booking:confirmed', handler);
```

### Event fires twice

Check that you haven't registered the event listener inside code that runs on every page navigation (like SPA route changes). Event listeners should be registered once when the page loads.

### event.detail is undefined

Make sure you're listening for the correct event name with the colon (`:`) - it should be `muddy.booking:confirmed`, not `muddy.booking.confirmed` or similar.

### Amounts look 100× too high

All monetary amounts in the event data are in minor units (pence for GBP, cents for USD, etc.). Divide by 100 to get the major currency units for display or analytics platforms that expect major units.