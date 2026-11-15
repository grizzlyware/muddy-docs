# Complete Opening Times Structure

Checked against v0.174.0. There is now only one level of opening times: per offering. See opening-times-structure.md.

- Business-level opening times (`/opening-times`) were removed and redirect.
- Walk-level opening times (`/walks/{id}/opening-times`) no longer exist; walks became resources, services and offerings.
- There is no "Inherit from business" option.
- An offering with no opening times can't be booked; its overview shows a "Set opening times" button.

## Available Time Presets
- 24/7
- 05:00 to 22:00
- 06:00 to 20:00
- 06:00 to 22:00
- 08:00 to 20:00
- 09:00 to 17:00
- 09:00 to 21:00
- 10:00 to 16:00
- Sunrise to sunset (only when the resource has a location)
- First light to last light (only when the resource has a location)
- Closed
- Custom: manual times, optionally anchored to sun times with an offset
