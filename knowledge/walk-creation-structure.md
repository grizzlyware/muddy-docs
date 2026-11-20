# Walk Creation Process Structure (legacy)

"Walks" no longer exist as a page in the app (checked against v0.174.0). Old `/walks/...` URLs redirect.
What used to be a walk is now built from a resource, a service and an offering. See offerings-structure.md.

Where the old walk settings went:
- Name, address, what3words, description, timezone, cover photo, display noun: resource settings (`/resources/{id}/settings`)
- Display verb: service settings (`/services/{id}/settings`)
- Display subject: removed entirely (v0.174.0). There is no subject word any more.
- Future/notice/cancellation periods, buffer, tax classification, access instructions: offering settings (`/offerings/{id}/settings`)
- Maximum number of dogs: removed as a setting. Limits now come from a count question's "At most" on the offering's Prices page.
- Pricing: offering Prices page (`/offerings/{id}/pricing`), see pricing-structure.md
- Opening times and "Start booking slots at": offering opening times (`/offerings/{id}/opening-times`)
- Block outs: resource menu > Block outs, or the main Block outs page
- Advanced (resources that block slots here): resource menu > Advanced
