---
title: Tracking bookings with analytics events
category: Website embedding
description: Fire Google Analytics, GTM, Meta Pixel and other analytics events when customers confirm, reschedule or cancel a booking inside the Muddy embed.
tags:
  - embeds
  - analytics
  - ga4
  - gtm
  - tracking
order: 50
pinned: false
---
The Muddy embed sends an event to your page whenever a customer confirms, reschedules or cancels a booking. You can listen for these and pass them on to Google Analytics, Google Tag Manager, Meta Pixel or any other analytics tool.

If the [Muddy embed snippet](embedding-on-wordpress.md#finding-your-embed-code) is on the page, the events are already firing. All you need to add is a listener.

## Which events to listen for

Add listeners to `window`, not the iframe or the `message` event. The full payloads are in the [Embed JavaScript API](embed-javascript-api.md) reference.

- **`muddy.booking:confirmed`** fires once, on the confirmation page after a booking. Use this for conversion tracking.
- **`muddy.booking:rescheduled`** fires when a booking is rescheduled or edited.
- **`muddy.booking:cancelled`** fires as soon as a customer cancels a booking.

## Minimal example

Add this to your page to check the events are arriving:

```js
window.addEventListener('muddy.booking:confirmed', function (event) {
  console.log('Booking confirmed', event.detail);
});
```

Open your browser console and make a test booking through the embed. The payload is logged when you reach the confirmation page.

## Google Analytics 4 (gtag.js)

This sends a GA4 `purchase` event on confirmation, a `refund` event on cancellation and a custom event on reschedule.

```js
window.addEventListener('muddy.booking:confirmed', function (event) {
  var d = event.detail;

  gtag('event', 'purchase', {
    transaction_id: d.reference,
    value: Number(d.price.total.amount),
    currency: d.price.total.currency,
    items: [{
      item_id: String(d.slot.has_slots.id),
      item_name: d.slot.has_slots.label,
      item_category: d.slot.has_slots.type,
      price: Number(d.price.total.amount),
      quantity: 1
    }]
  });
});

window.addEventListener('muddy.booking:cancelled', function (event) {
  var d = event.detail;

  gtag('event', 'refund', {
    transaction_id: d.reference,
    value: Number(d.price.total.amount),
    currency: d.price.total.currency
  });
});

window.addEventListener('muddy.booking:rescheduled', function (event) {
  var d = event.detail;

  gtag('event', 'booking_rescheduled', {
    transaction_id: d.reference,
    item_name: d.slot.has_slots.label,
    new_start: d.slot.start.iso
  });
});
```

## Google Tag Manager (dataLayer)

Push each event onto the dataLayer and let GTM send it on to GA4, Meta Ads or anywhere else.

```js
window.dataLayer = window.dataLayer || [];

['confirmed', 'rescheduled', 'cancelled'].forEach(function (state) {
  window.addEventListener('muddy.booking:' + state, function (event) {
    var d = event.detail;

    window.dataLayer.push({
      event: 'muddy_booking_' + state,
      muddy: {
        booking_id: d.id,
        booking_reference: d.reference,
        value: Number(d.price.total.amount),
        currency: d.price.total.currency,
        walk_id: d.slot.has_slots.id,
        walk_name: d.slot.has_slots.label,
        slot_start: d.slot.start.iso
      }
    });
  });
});
```

### Setting up the GTM triggers

1. In GTM, create a **Custom Event** trigger. Set the event name to `muddy_booking_confirmed`. Repeat for `muddy_booking_rescheduled` and `muddy_booking_cancelled`.
2. Create **Data Layer Variables** for the fields you need, for example `muddy.booking_reference`, `muddy.value`, `muddy.currency` and `muddy.walk_name`.
3. Use those variables in a GA4 Event tag, or any other tag, and set its trigger to the Custom Event from step 1.

## Meta / Facebook Pixel

```js
window.addEventListener('muddy.booking:confirmed', function (event) {
  var d = event.detail;

  fbq('track', 'Purchase', {
    value: Number(d.price.total.amount),
    currency: d.price.total.currency,
    content_ids: [String(d.slot.has_slots.id)],
    content_name: d.slot.has_slots.label,
    content_type: 'product'
  });
});
```

## Forwarding to any analytics SDK

PostHog, Segment, Mixpanel, Amplitude and your own endpoints all work the same way: read `event.detail`, pick the fields you want, and call your SDK's tracking method.

```js
window.addEventListener('muddy.booking:confirmed', function (event) {
  var d = event.detail;

  analytics.track('Booking Confirmed', {
    booking_reference: d.reference,
    value: Number(d.price.total.amount),
    currency: d.price.total.currency,
    walk_name: d.slot.has_slots.label,
    slot_start: d.slot.start.iso
  });
});
```

## Troubleshooting

**The `value` sent to analytics is a string or `NaN`.** `amount` is a decimal string like `"25.00"`. Wrap it in `Number(...)` before passing it to GA4, Meta Pixel and so on, or use `amount_minor` if your tool wants minor units.

**The event fires twice.** You may be adding the listener in code that runs on every route change of a single-page app. Add it once, at page load.

For other problems, such as nothing firing, `event.detail` being undefined or missing customer data, see [Troubleshooting](embed-javascript-api.md#troubleshooting) in the Embed JavaScript API reference.
