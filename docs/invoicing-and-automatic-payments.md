---
title: Invoicing and automatic payments
category: Payments
tags:
  - invoicing
  - payments
  - customers
order: 20
description: Learn how to raise invoices, set up automatic invoicing, and capture payments from your customers.
pinned: false
---

## How invoicing works

Invoicing lets you bill customers after their bookings have finished, instead of requiring payment upfront. This is useful if you have regular customers — like professional dog walkers — who you'd prefer to invoice on a schedule.

Customers must be logged in to book without paying upfront, and invoices can only be raised for bookings that have already finished.

## Setting up customer groups

Before you can invoice customers, you'll need to create a customer group. This lets you control which customers can book without paying upfront.

### Step 1: Go to customer groups

Click **Settings** in the left-hand menu, then click **Customer groups**.

![Settings page with Customer groups highlighted](../screenshots/inv-step-one-CMnS9SNl.webp)

### Step 2: Create a group

Click the **Create** button to add a new customer group. Give it a name that makes sense for your business — for example, "Dog Walkers" for professional dog walkers who visit regularly.

![Customer groups page with Create button](../screenshots/inv-step-two-B0nhT4yg.webp)

## Adding customers to a group

### Step 3: Create or find a customer

Click **Customers** in the left-hand menu. If you need to add a new customer, click **Create customer** and fill in their name, phone number, and email address.

![Customers page with Create customer button](../screenshots/inv-step-three-CLSOVVWE.webp)

### Step 4: Assign them to a group

Open the customer's profile and click **Change customer groups** at the bottom right. Search for and select the group you created, then click **Save changes**.

![Assigning a customer to the Dog Walkers group](../screenshots/inv-step-four-DI96OJ0H.webp)

## Allowing customers to book without paying upfront

### Step 5: Open payment settings

Go to **Settings** and click **Payment settings** under the Payments section.

![Settings page with Payment settings highlighted](../screenshots/inv-step-five-BugNhB6A.webp)

### Step 6: Choose who can book without paying

Under **Upfront payment policy**, select **Exclude specific groups**. Then choose the customer group you created (e.g. "Dog Walkers") from the list below.

This means customers in that group can book without paying upfront. Everyone else will still need to pay at the time of booking.

If you want all customers to be able to book without paying, select **Not required** instead.

Click **Save** when you're done.

![Payment settings with Exclude specific groups selected](../screenshots/inv-step-six-B3KFt4ie.webp)

## Booking as a customer (impersonation)

### Step 7: Make a booking on behalf of a customer

If you need to create a booking for a customer, go to their profile and click **Impersonate**. This lets you use the booking form as if you were that customer.

![Customer profile with Impersonate button](../screenshots/inv-step-seven-Dcvtyw_a.webp)

### Step 8: Complete the booking

Choose a walk, pick a date and time, and click **Confirm booking**. Because this customer is in a group that doesn't require upfront payment, they won't be asked to pay.

![Booking form with Confirm booking button](../screenshots/inv-step-eight-YU31mDkj.webp)

## Raising invoices

Invoices can only be raised for bookings that have already finished. Once a booking is complete:

### Step 9: Raise invoices from the customer profile

Go to the customer's profile and click **Raise invoices**. This will create invoices for all of that customer's completed, uninvoiced bookings.

![Customer profile with Raise invoices button](../screenshots/inv-step-nine-B_QySjQc.webp)

## Configuring invoicing settings

### Step 10: Open invoicing settings

Go to **Settings** and click **Invoicing** under the Payments section.

![Settings page with Invoicing highlighted](../screenshots/inv-step-ten-DQaTyaXj.webp)

### Step 11: Set your preferences

Here you can configure how invoicing works for your business:

![Invoicing settings page](../screenshots/inv-step-eleven-CJxgW3E7.webp)

- **Invoice schedule** — Choose when invoices are automatically created for completed bookings (e.g. monthly on the 1st). The system will create invoices for all uninvoiced, unpaid bookings that have ended.
- **Payment terms** — The number of days after invoice creation that payment is due. Setting this to 0 means payment is due immediately.
- **Invoice header text** — Optional text to display at the top of invoices, such as your business address, payment instructions, or bank details.
- **Next invoice number** — Set a custom starting invoice number if you're migrating from another system. Leave empty to continue from the current sequence.

### Step 12: Set up automatic payments and reminders

Further down the page, you can also configure:

![Automatic payment settings](../screenshots/inv-step-twelve-xccghDYJ.webp)

- **Send reminder before due date** — Send a single payment reminder before the invoice due date.
- **Send reminders after due date** — Send recurring payment reminders for overdue invoices.
- **Automatically take payment** — When switched on, the system will attempt to charge customers' saved payment methods for unpaid invoices on the due date.
- **Retry interval** — How many days to wait between payment attempts if a payment fails.
- **Maximum attempts** — The maximum number of payment attempts per invoice before giving up.

Click **Save** when you're done.

## Viewing and managing invoices

### From the invoice page

Click **Invoices** in the left-hand menu to see all your invoices. You can see each invoice's number, date, total, customer, and status.

![Invoices list page](../screenshots/inv-step-fourteen-DEJ2RI0J.webp)

### From an individual invoice

Click on any invoice to view its details. From here you can:

- **Record payment** — Manually record a payment against the invoice
- **Cancel invoice** — Cancel the invoice if it's no longer needed
- **Download PDF** — Download a PDF copy of the invoice
- **Email to customer** — Send the invoice directly to the customer's email

![Invoice detail page](../screenshots/inv-step-thirteen-DToL_Sm5.webp)
