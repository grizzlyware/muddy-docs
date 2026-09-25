# Shop Delivery Structure

Written by hand from the shop source code on 23 September 2026, and checked again on 24 September 2026. Page: `/manage/operators/{id}/shop/delivery`.

## Page sections
- Page title: "Collection and delivery" (the Shop and Settings tiles use the same name).
- "Collection and delivery methods", "Delivery rates", "Places you don't deliver to". The last shows only when at least one method is offered, and not during shop setup (`?setup=1`). During setup, "Delivery rates" shows only once a delivery method exists.
- A "Weight warning" appears when a rate uses weight but some physical products have no weight.

## Delivery methods
- Buttons: "Add a collection point" (primary) and "Add a delivery method" (outline).
- Table columns: drag handle, "Name", "Type", "Estimate", "Rates". Drag the handle to reorder methods; this is the order customers see.
- Delivery form: "Name" (placeholder "Standard delivery") and "Estimate" (placeholder "2 to 3 working days"). Button: "Add method".
- Collection form: "Name", "Instructions", and the "Customers help themselves" switch (for lockers). Button: "Add collection point".
- A method can't change type after it is created.
- "Stop offering" (confirm "Stop offering it") archives a method. "Offer again" restores it. Rates are kept.
- Collection points are always free and offered to every address.

## Delivery rates
- "Add a delivery rate" is disabled until a delivery method exists.
- Form fields:
  - "Delivery method" (add only), "Country" (includes "Everywhere else"), "County" ("Anywhere in that country"), "Postcodes".
  - "Price", "Tax classification" (defaults to "None"), and the checkbox "Price includes tax" (shown only when the classification isn't None; ticked by default).
  - "From order value", "Under order value", "From weight (grams)", "Under weight (grams)".
- Button: "Add delivery rate" / "Save changes". Table actions: "Edit" and "Remove" (confirm "Remove it").
- "From" limits include the value entered; "Under" limits exclude it.
- Order value is the cost of the goods after discounts, including VAT, and excluding delivery.
- There is no free-delivery setting. Add a £0 rate with "From order value" set instead. Customers see "Free".

## Postcodes
- The field is a single line. Separate entries with commas. Case and spaces are ignored.
- A prefix entry (e.g. IV, TR18) matches any postcode that starts with it. PA2 therefore also matches PA20-PA29.
- A range entry (PA20-49 or PA20-PA49) matches district numbers from 20 to 49. A range that changes area (PA20-PB49) is refused when saving.

## Choosing the price (for each method)
- Rates and exclusions are ranked by how specific they are: postcode > county > country > everywhere else.
- On a tie, an exclusion beats a rate, then the cheaper rate wins.
- If the winner is an exclusion, the method is not offered.

## Exclusions
- "Add a place" is disabled until a rate exists.
- Form heading: "Add a place you don't deliver to". Button: "Stop delivering there".
- An exclusion must sit inside the country or county of an existing rate for the same method.

## Checkout behaviour
- Delivery options appear after the customer enters an address. A postcode is required if any rate for that country uses postcodes.
- If nothing matches, the customer sees "We don't deliver to {country} at the moment." (or "We can't deliver to that address at the moment.") and, if the operator can be contacted, "Think we should deliver there? Get in touch." with their contact details.
