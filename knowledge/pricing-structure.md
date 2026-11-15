# Muddy Booking Pricing Structure

## Offering Prices page (replaced the legacy pricing form in v0.174.0)
- Each offering (a service at a resource) has its own Prices page.
- Path: Offerings (left-hand menu) > click the offering > Settings menu > Prices (menu description: "Durations, prices and questions").
- Page heading: "Prices: <offering>". Three cards: Base prices, Separate prices (only when a qualifying question exists), Questions.
- No page-wide save. Every change happens in a pop-up or confirm with its own Save; the page only shows saved data. Closing a pop-up with unsaved changes asks "Discard your changes ...?" (Keep editing / Discard).
- The legacy form is gone: no duration tabs, no "Price per extra dog", "Extra dogs surcharge", "Total included dogs", "Separate commercial price?", "Save all pricing configurations" or "Delete this duration". Dogs and commercial pricing are now questions (legacy data was moved to a "Dogs" number question and a commercial yes/no question).

### Base prices
- Card text: "What each duration costs before any extra charges from the questions." Button: **Edit base prices**.
- No durations: "Customers can't book this until it has at least one duration."
- Base prices pop-up: one price per duration (per column when split), **Add duration** > **Duration in minutes** (1 to 1440, suggestions offered) > **Add**; bin icon removes a duration (must keep at least one).
- **Prices include tax?** Yes/No (per column when split: "Do prices for "X" include tax?"). No = "Tax is added on top at checkout."
- Every duration needs a price in every column ("Enter a price for ...").
- Removing a duration used by live recurring bookings is refused: "Removing X conflicts with N recurring bookings. Please change them first." with links.

### Separate prices (splitting base prices by an answer)
- Only shown when the offering asks a list or yes/no question with at least 2 open answers.
- Choices: "No, everyone pays the same prices" or "Yes, by their answer to: <question>". Each answer gets its own column of base prices.
- Help: "Most price differences belong on a question's extra charges. Use this only when some customers pay different base prices for every duration, for example businesses."
- Confirm: "Are you sure you want to change this?" / **Change it**.
  - Turning on: current prices (including that question's extra charges) are copied into each answer's column so no price changes; then the Base prices pop-up opens to adjust them. The splitting question has no extra charges of its own.
  - Switching question or turning off: keeps the default answer's column (or the first) and REMOVES the other columns' prices.
  - "Existing bookings keep the price they were booked at."
- Other questions' prices can differ per column: switch off "Same charge/price whatever customers answer to "<question>"".

### Questions
- Card text: "Customers answer these when they book." Each row: prompt, type line (e.g. "A number · 1 to 4 · starts at 1", "Yes or no · starts on No"), a price summary per column, **Edit** button.
- Add button: **Add a question**, or **Write your own question** while suggestions show.
- Add pop-up ("Add a question to <offering>"):
  - **Ask a question you already use** (reuse a question from another offering; fills in its settings from there), or write a new one.
  - **Question** (max 255 chars, what customers see), **Short name** (max 40 chars, shown next to the answer on booking pages and emails; must be unique per business: "You already have a question called X.").
  - **How do customers answer?**: **A number**, **Pick from a list**, **Yes or no**.
  - Answers/Kinds: up to 20 open, each up to 60 chars, unique names. A list needs at least 2 answers. Yes/no answers are fixed (No, Yes).
  - **Also add it to**: other offerings, which start with the same prices and settings.
  - **Add question**. If live recurring bookings exist at the target offerings, a confirm "This affects N recurring bookings" says their future bookings will use the default answer (or the "At least" number) and its price.
- List / yes-no settings per offering: **Default answer** (pre-picked for customers), **Extra charge for <answer>** (added to base price, empty = none). Toggle **Same charge for every duration**.
- Number settings per offering: **At least** (starting and minimum number, default 0), **At most** (max, all kinds added together; empty = no limit). Prices: **Included in the price**, **Price for each extra one**, **One-off charge for going over**, **Add a price step** (**From answer number** >= 2, **Price for each one**; each step must start after the one before). Toggle **Same price for every duration**.
- Kinds (number questions only): optional, e.g. Small/Large or Adults/Children; customers enter a number per kind; each kind priced separately; a new kind is free until priced.
- Changing At least / At most so that live recurring bookings fall outside is refused with links to them.
- Suggested questions: only when the offering has no questions; based on the business type preset (Terminology > Apply preset). Examples: dog field hire: Dogs (number, 1 to 4), Professional (yes/no, default No), People (number). Dog training: Dogs, Age (Puppy under 6 months / Adult). Dog grooming: Dogs by size (kinds Small, Medium, Large, Extra large), Coat (list), Matted coat (yes/no). Equine arena hire: Horses, Jumps. Click **Add** to open it pre-filled. Suggestions disappear on leaving the page.

### Edit pop-up ("<short name> at <offering>")
- Edits this offering's default/limits/prices; **Save**.
- **Change the wording or answers** / **Change the wording or kinds** / **Change the wording**: changes the question everywhere it is asked (lists the offerings); past bookings show the new wording, prices unchanged. Add/rename/archive answers or kinds; **Back** / **Save**.
- Archive an answer (**Archive** button) or kind (archive icon), applied on Save:
  - Customers can't pick it; past bookings still show it. Can't archive the last open one. Can't archive an answer that is the default anywhere ("X is the default answer at Y. Pick another default answer there first.").
  - If live recurring bookings use it, confirm "This affects N recurring bookings": list answers move to each offering's default answer and its price; kinds are dropped from the series. Archiving a kind is refused if it takes a series under the minimum.
  - If the answer has its own price column, the column is hidden while archived; **Bring back** restores the answer and its column.
- **Stop asking this question** > confirm "Are you sure you want to stop asking this question?" > **Stop asking**. Removes its prices on this offering; if it splits prices, everyone pays the default answer's column and the other columns are removed. Existing bookings keep their price. A question asked nowhere is archived, freeing its name.

### Booking form
- List and yes/no: radio list with the default pre-selected.
- Number: number box from At least to At most; with kinds, one box per kind.
- Price = base price for the duration (customer's column if split) + extra charges from answers.

## Price Adjustments (/price-adjustments)

### Types of Adjustments
- **Discounts**: Reduce booking prices
- **Surcharges**: Add to booking prices

### Discount/Surcharge Configuration
- **Name**: Internal identifier for the adjustment
- **Valid from/to**: Date range for availability
- **Type**: Percentage or fixed amount
- **Active status**: Enable/disable toggle
- **Auto-apply**: Automatic application to bookings
- **Original price basis**: Calculate on original vs. adjusted price

### Discount Codes
- Manual codes for customer use
- Generate button for automatic code creation
- Must be unique, letters and numbers only

### Discount Rules (Conditional Logic)
Available rule types for when adjustments apply:
- Must have no discounts/surcharges
- Start time before/after specific time
- Price above/below threshold  
- Specific walks (include/exclude)
- Booking group size limits
- Dog count limits
- Booking type (rescheduled, replacement)
- Customer group membership
- Light conditions (before/after first/last light)
- Date ranges
- Specific days of week

### Ordering
- Multiple adjustments can be ordered by priority
- Lower numbers applied first