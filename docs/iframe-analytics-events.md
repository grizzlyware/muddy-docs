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

## How it works

The Muddy embed is an iframe. When something notable happens inside the iframe (such as a booking being confirmed), the embed posts a message to your page. A small piece of code that ships with the embed catches that message and re-broadcasts it as a standard browser `CustomEvent` on your page's `window` object.

Every event name starts with `muddy.` and the event data lives on `event.detail`.

- Listen on `window`, not on the iframe element.
- Events only fire when the iframe is actually present. You can register listeners before the Muddy script tag loads — they will simply wait.
- No personal information about the customer (name, email, phone number) is ever included in the payload. Only booking identifiers, the slot, and the price.

## Money values in the payload

Every price field follows the same shape, with both a decimal string and an integer in minor units:

```js
{
  amount: "25.00",           // decimal string in major units
  amount_minor: 2500,        // integer in minor units (pence, cents)
  currency: "GBP",
  is_positive: true,
  is_negative: false,
  is_zero: false,
  formatted: {
    full: "£25.00",
    short: "£25",
    full_absolute: "£25.00",
    full_negated: "-£25.00"
  }
}
```

Most analytics tools expect a number. Use `Number(d.price.total.amount)` to convert the string to a number, or use `amount_minor` directly if the tool prefers integer cents.

## Available events

### muddy.mounted

Fires once, when the Muddy embed has finished loading.

`event.detail` is an empty object. Useful as an "embed is ready" signal.

### muddy.mobile

Fires when the embed switches between its mobile and desktop layouts (and once on first mount). Does **not** fire on every page change inside the embed.

`event.detail`:

```js
{
  isMobile: true
}
```

### muddy.booking:confirmed

Fires the first time the customer lands on their booking confirmation page after a successful booking. Reloading the confirmation page does not re-fire the event.

This is the event you want to use for conversion tracking.

`event.detail`:

```js
{
  id: 12345,
  reference: "BK-8F3K2",
  slot: {
    id: "signed-slot-id",
    signed_id: "signed-slot-id",
    start: { iso: "2026-05-10T10:00:00+01:00" /* ... */ },
    end:   { iso: "2026-05-10T11:00:00+01:00" /* ... */ },
    is_past: false,
    is_future: true,
    is_happening_now: false,
    has_slots: {
      id: 42,
      label: "Morning Group Walk",
      type: "walk",
      operator_id: 7
    }
  },
  price: {
    net:   { amount: "20.83", amount_minor: 2083, currency: "GBP", /* ... */ },
    tax:   { amount: "4.17",  amount_minor: 417,  currency: "GBP", /* ... */ },
    total: { amount: "25.00", amount_minor: 2500, currency: "GBP", /* ... */ }
  }
}
```

### muddy.booking:rescheduled

Fires when a customer lands on a booking page after completing a reschedule.

`event.detail` has the same shape as `muddy.booking:confirmed`.

### muddy.booking:cancelled

Fires immediately after a customer cancels a booking, before the page reloads. Attach your listener early so you don't miss it.

`event.detail` has the same shape as `muddy.booking:confirmed`.

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

**Nothing is firing.** Make sure the Muddy embed script is on the page, and that your listener is bound to `window` — not to the iframe element, and not to a `message` event.

**The event fires twice.** Check you are not registering the listener inside a block that runs on every SPA route change on the host page. Register it once, at page load.

**`event.detail` is `undefined`.** You have almost certainly bound to `message` instead of to `muddy.booking:confirmed`. Use the exact event name, including the colon.

**The `value` sent to analytics is a string or `NaN`.** `amount` is a decimal string like `"25.00"`. Wrap it in `Number(...)` before passing to GA4, Meta Pixel etc. If your tool prefers integer minor units, use `amount_minor` instead.

**Customer data is missing from the payload.** That is intentional — payloads never contain personal information. Use `reference` as your join key if you need to correlate with server-side data.
