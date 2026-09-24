---
title: Embed JavaScript API
category: Website embedding
description: Reference for the Muddy embed, covering launch triggers, layout events, and the booking event payloads you can listen for on your page.
tags:
  - embeds
  - javascript
  - api
  - events
order: 40
pinned: false
---
The Muddy embed gives your page a small JavaScript API. You can open the booking flow from your own button, react when the embed switches between its mobile and desktop layouts, and listen for bookings to pass on to other systems.

If you only want to send bookings to Google Analytics, GTM or another analytics tool, see [Tracking bookings with analytics events](iframe-analytics-events.md).

## How it works

The Muddy embed is an iframe. The embed snippet on your page listens for messages from the iframe and re-dispatches them as `CustomEvent`s on your page's `window`.

Every event name starts with `muddy.` and the event data lives on `event.detail`.

- Listen on `window`, not on the iframe element.
- You can add listeners before the Muddy script loads.
- Payloads never include the customer's personal details, such as their name, email or phone number.

## Launching the embed from your own button

Add `data-muddy-action="launch"` to any clickable element, such as a button, link or image. What happens on click depends on the screen size:

- **On mobile:** the embed opens fullscreen over your page.
- **On desktop:** the page scrolls to the embed.

```html
<button data-muddy-action="launch">Book now</button>
```

```html
<a href="#book" data-muddy-action="launch">Reserve your spot</a>
```

You can put the attribute on as many elements as you like.

Notes:

- The [embed snippet](embedding-on-wordpress.md#finding-your-embed-code) must still be on the page. The attribute opens the embed but doesn't load it.
- The element's default click behaviour is prevented, so links and forms don't navigate away.
- Launchers are found when the embed initialises. Elements added later, for example by an AJAX update, are not picked up.

## Layout events

### muddy.mobile

Fires once when the embed mounts, then whenever it switches between its mobile and desktop layouts. It does **not** fire on page changes inside the embed.

`event.detail`:

```js
{
  isMobile: true
}
```

```js
window.addEventListener('muddy.mobile', function (event) {
  if (event.detail.isMobile) {
    document.body.classList.add('muddy-is-mobile');
  } else {
    document.body.classList.remove('muddy-is-mobile');
  }
});
```

### muddy.full_screen

Fires when the embed opens or closes its fullscreen overlay, which happens when a customer taps a launcher on mobile and when they close the embed.

`event.detail`:

```js
{
  fullScreen: true
}
```

```js
window.addEventListener('muddy.full_screen', function (event) {
  if (event.detail.fullScreen) {
    // Embed is covering the page, so hide your own sticky header etc.
  } else {
    // Embed has returned to its inline layout.
  }
});
```

While fullscreen, the embed sets `overflow: hidden` on `document.body` so the page behind can't scroll, and removes it on close.

## Booking events

These fire when a customer completes, changes or cancels a booking in the embed. They're usually the ones you'll send to analytics tools.

### muddy.booking:confirmed

Fires the first time the customer reaches their confirmation page after booking. Reloading the page doesn't fire it again.

Use this event for conversion tracking.

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

Listen for it with `window.addEventListener`:

```js
window.addEventListener('muddy.booking:confirmed', function (event) {
  var booking = event.detail;

  console.log('Booking confirmed', booking.reference, booking.price.total.formatted.full);
});
```

Every `muddy.*` event works the same way. Only the name and the shape of `event.detail` change.

### muddy.booking:rescheduled

Fires when a customer reaches a booking page after rescheduling. It also fires when a booking is edited, in which case the `reference` stays the same. A reschedule generates a new `reference`.

`event.detail` has the same shape as `muddy.booking:confirmed`.

### muddy.booking:cancelled

Fires as soon as a customer cancels a booking, before the page reloads. Add your listener early so you don't miss it.

`event.detail` has the same shape as `muddy.booking:confirmed`.

## Money values in the payload

A booking's `price` has `net`, `tax` and `total`. Each of these, like every other amount in the payload, is a Money value with both a decimal string and an integer in minor units:

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

Most analytics tools expect a number. Use `Number(d.price.total.amount)`, or `amount_minor` if the tool wants minor units.

## Troubleshooting

**Nothing is firing.** Check the Muddy embed script is on the page and your listener is on `window`, not the iframe element or a `message` event.

**My launch button does nothing.** Check the embed snippet is on the same page and the attribute is exactly `data-muddy-action="launch"`. The element must exist when the embed script runs, as elements added later are ignored.

**`muddy.full_screen` never fires on desktop.** That's expected. Fullscreen is only used on mobile. On desktop, a launcher scrolls to the embed instead.

**The event fires twice.** You may be adding the listener in code that runs on every route change of a single-page app. Add it once, at page load.

**`event.detail` is `undefined`.** You're probably listening for `message` instead of the `muddy.*` event. Use the exact event name, including the colon in booking events and the underscore in `full_screen`.

**Customer data is missing from the booking payload.** That's deliberate, as payloads never contain personal details. To match a booking with your own records, use `reference`.
