---
title: Embed JavaScript API
category: Website embedding
description: Complete reference for the Muddy embed — launch triggers, layout events, and booking event payloads you can listen for on your page.
tags:
  - embeds
  - javascript
  - api
  - events
order: 40
pinned: false
---
The Muddy embed exposes a small JavaScript surface on the host page. You can trigger the booking flow from your own button, react to layout changes as the embed switches between mobile and desktop, and listen for booking activity to forward into other systems.

If you just want to wire booking events into Google Analytics, GTM or another analytics tool, see the recipe-focused guide: [Tracking bookings with analytics events](./iframe-analytics-events).

## How it works

The Muddy embed is an iframe. The embed snippet on your page listens for messages from that iframe and re-broadcasts them as standard browser `CustomEvent`s on your page's `window` object.

Every event name starts with `muddy.` and the event data lives on `event.detail`.

- Listen on `window`, not on the iframe element.
- You can register listeners before the Muddy script tag loads — they will simply wait.
- No personal information about the customer (name, email, phone number) is ever included in any payload.

## Launching the embed from your own button

Add `data-muddy-action="launch"` to any element on your page (a button, a link, an image, anything clickable). When a customer clicks it, the embed decides what to do based on the viewport:

- **On mobile:** the embed opens fullscreen over your page.
- **On desktop:** the page smoothly scrolls to bring the embed into view.

```html
<button data-muddy-action="launch">Book now</button>
```

```html
<a href="#book" data-muddy-action="launch">Reserve your spot</a>
```

The attribute works on multiple elements on the same page — every matching element becomes a launcher.

Notes:

- The embed snippet itself must still be on the page. The `data-muddy-action="launch"` attribute only triggers the embed; it does not load it.
- Default link and form behaviour is suppressed on click, so the page does not navigate away.
- Launchers are wired up when the embed initialises. If you add launcher elements to the page later (for example after an AJAX update), they will not be picked up automatically.

## Layout events

### muddy.mobile

Fires when the embed switches between its mobile and desktop layouts (and once on first mount). Does **not** fire on every page change inside the embed.

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

Fires whenever the embed enters or leaves its fullscreen overlay. This happens when a customer taps a launcher on mobile, and again when they close the embed.

`event.detail`:

```js
{
  fullScreen: true
}
```

```js
window.addEventListener('muddy.full_screen', function (event) {
  if (event.detail.fullScreen) {
    // Embed is covering the page — hide your own sticky header, etc.
  } else {
    // Embed has returned to its inline layout.
  }
});
```

While the embed is fullscreen it sets `overflow: hidden` on `document.body` so the page behind it cannot scroll. That styling is cleared automatically when fullscreen is dismissed.

## Booking events

These fire as customers complete, change or cancel bookings inside the embed. They are the events you normally want to forward into analytics tools.

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

Fires when a customer lands on a booking page after completing a reschedule. This event also fires when a booking is updated or edited — in that case the `reference` will be the same as before. When a booking is truly rescheduled, a new `reference` is generated.

`event.detail` has the same shape as `muddy.booking:confirmed`.

### muddy.booking:cancelled

Fires immediately after a customer cancels a booking, before the page reloads. Attach your listener early so you don't miss it.

`event.detail` has the same shape as `muddy.booking:confirmed`.

## Money values in the payload

The `price` object on a booking is a taxed money value — an object with `net`, `tax` and `total`. Each of those (and every other monetary value anywhere in the payload) is a Money value that follows the same shape, with both a decimal string and an integer in minor units:

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

Most analytics tools expect a number. Use `Number(d.price.total.amount)` to convert the string to a number, or use `amount_minor` directly if the tool prefers integer minor units.

## Troubleshooting

**Nothing is firing.** Make sure the Muddy embed script is on the page, and that your listener is bound to `window` — not to the iframe element, and not to a `message` event.

**My launch button does nothing.** Check the embed snippet is on the same page and that the attribute is spelled exactly `data-muddy-action="launch"`. The attribute must be present when the embed script runs — elements added to the DOM afterwards are ignored.

**`muddy.full_screen` never fires on desktop.** That is expected. Fullscreen is only used for the mobile layout; on desktop, clicking a launcher scrolls to the embed instead.

**The event fires twice.** Check you are not registering the listener inside a block that runs on every SPA route change on the host page. Register it once, at page load.

**`event.detail` is `undefined`.** You have almost certainly bound to `message` instead of to the `muddy.*` event. Use the exact event name, including the colon in booking events and the underscore in `full_screen`.

**Customer data is missing from the booking payload.** That is intentional — payloads never contain personal information. Use `reference` as your join key if you need to correlate with server-side data.
