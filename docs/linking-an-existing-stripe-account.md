---
title: Linking an existing Stripe account
category: Payments
tags:
  - stripe
  - payments
  - settings
order: 30
description: Use a Stripe account you already have for card and Direct Debit payments, and choose which account new payments go to.
pinned: false
---

## Do you need to do this?

Muddy Booking sets up a Stripe account for you when you sign up, and you finish it from **Stripe setup** in the left-hand menu. That account is all you need to take card payments.

Link an account only if you already have your own Stripe account and want your payments to go there instead. Linking and switching are two separate steps:

1. Link the account. Nothing changes for your customers yet.
2. Make it primary. From then on, new payments go to that account.

Before you start, make sure:

- You can sign in to the Stripe account you want to link.
- The account is a live account, not a test account.
- The account isn't already linked to another business on Muddy Booking.

## Step 1: Link your Stripe account

1. Click **Settings** in the left-hand menu.
2. Under **Payments**, click **Payment methods**.
3. Click **Add**.
4. In the **Gateway** menu, choose **Stripe**.
5. Click **Link account**.
6. A pop-up explains what linking does. Click **Continue to Stripe**.
7. Sign in to Stripe if it asks you to.
8. Choose the account you want to use with Muddy Booking.
9. Follow Stripe's steps to give Muddy Booking access to the account.

Stripe then sends you back to Muddy Booking. You'll see **Stripe account linked**, and the account appears in your list of payment methods with its name under the method name.

If you stop part-way on Stripe, nothing changes. You'll see "You didn't finish linking your Stripe account, so nothing has changed." on the **Add payment method** page, and you can try again.

### If the account won't link

If Muddy Booking can't link the account, the **Add payment method** page shows the reason:

- **That Stripe account is in test mode**: choose a live account instead.
- **That Stripe account is already linked to your business**: it's already in your list of payment methods.
- **That Stripe account is linked to another business on Muddy**: contact us if you need to move it.
- **Stripe did not link the account**: try again.

## Step 2: Make the account primary

Your primary Stripe account is the one new payments go to. You can only have one at a time.

1. Click **Settings** in the left-hand menu.
2. Under **Payments**, click **Payment methods**.
3. Click the Stripe account you linked.
4. Click **Make primary** at the top of the page.
5. Read the pop-up. It tells you which account new payments will go to, and what happens to payments you've already taken.
6. Click **Make primary**.

You'll see **New payments will go to this account**. In your list of payment methods, the account now shows **Primary method for Stripe** under **Stripe**.

**Make primary** only appears on a Stripe account that is linked and isn't already primary.

### If Muddy Booking won't make it primary

Muddy Booking checks the account with Stripe before it switches. If Stripe isn't ready to take payments on it, nothing changes and you'll see why:

- **Stripe isn't letting this account take payments yet**: check your Stripe dashboard for anything you need to do.
- **Stripe needs more details for this account before it can take payments**: sign in to Stripe and add the details it asks for.
- **This Stripe account is no longer linked to Muddy**: link it again first (see [Step 1](#step-1-link-your-stripe-account)).

## What changes when you switch

- **New payments**: card and Direct Debit payments from your customers go to the new primary account.
- **Payments you've already taken**: these stay in the account that took them. Muddy Booking doesn't move them.
- **Refunds**: Muddy Booking refunds a payment through the account that took it. Keep your old account linked so you can still refund older payments.
- **Saved cards**: saved cards belong to the account they were saved with, so they don't move. Customers will need to add their card again the next time they pay.
- **Payments in progress**: anyone paying at the moment you switch may need to try again.

**Warning:** switching changes where your money goes. Pick a quiet time to do it, and check the new account is set up to pay out to the right bank account in Stripe first.

To switch back, open your old account under **Payment methods** and click **Make primary** on it.

You can't delete your primary Stripe account, or a Stripe account that has taken payments.

## If the account stops being linked

If someone removes Muddy Booking's access from your Stripe account in Stripe, Muddy Booking emails you with the subject "Your Stripe account is no longer linked". The account shows **Disconnected** in red in your list of payment methods.

Muddy Booking doesn't switch to another account for you. To fix it, link the same account again (see [Step 1](#step-1-link-your-stripe-account)).
