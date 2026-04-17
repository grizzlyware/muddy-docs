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
When you embed the Muddy booking flow on your website, the embed automatically broadcasts events to your page every time a customer confirms, reschedules or cancels a booking. You can listen for those events and forward them to Google Analytics, Google Tag Manager, Meta Pixel, or any other analytics tool you already use.

There is no extra setup. If the Muddy embed snippet is already on the page, the events are already firing — you just need to add a listener.

## Which events to listen for

Attach listeners to `window` (not to the iframe, and not to the `message` event). Full payload shapes are in the [Embed JavaScript API](./embed-javascript-api) reference.

- **`muddy.booking:confirmed`** — fires once on the confirmation page after a successful booking. This is the event you want for conversion tracking.
- **`muddy.booking:rescheduled`** — fires when a booking is rescheduled or edited.
- **`muddy.booking:cancelled`** — fires immediately after a customer cancels a booking.

## Minimal example

Drop this into your page to confirm the events are reaching you:

```js
window.addEventListener('muddy.booking:confirmed', function (event) {
  console.log('Booking confirmed', event.detail);
});
```

Open your browser console, make a test booking through the embed, and you should see the payload logged on the confirmation page.

## Google Analytics 4 (gtag.js)

Fire a GA4 `purchase` event on confirmation, a `refund` event on cancellation, and a custom event on reschedule.

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

If you use GTM, push each event onto the dataLayer and let GTM fan out to GA4, Meta Ads, and anywhere else you need.

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
2. Create **Data Layer Variables** for the fields you care about — for example `muddy.booking_reference`, `muddy.value`, `muddy.currency`, `muddy.walk_name`.
3. Wire those variables into a GA4 Event tag (or any other tag) and set its trigger to the Custom Event from step 1.

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

The pattern is the same for PostHog, Segment, Mixpanel, Amplitude, or an internal tracking endpoint: read `event.detail`, reshape as needed, then call your SDK's capture method.

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

**The `value` sent to analytics is a string or `NaN`.** `amount` is a decimal string like `"25.00"`. Wrap it in `Number(...)` before passing to GA4, Meta Pixel etc. If your tool prefers integer minor units, use `amount_minor` instead.

**The event fires twice.** Check you are not registering the listener inside a block that runs on every SPA route change on the host page. Register it once, at page load.

For general embed troubleshooting (nothing firing, `event.detail` undefined, missing customer data), see the [Embed JavaScript API](./embed-javascript-api#troubleshooting) troubleshooting section.
