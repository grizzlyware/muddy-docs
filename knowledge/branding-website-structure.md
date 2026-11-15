# Muddy Booking Branding and Website Customization Structure

## Main Settings Access
- Settings main page: `/settings`
- Organized into sections: Business, Offerings, Bookings, Payments, Shop, Notifications, Advanced

## Branding Settings (/settings/branding)
### Available Fields
- **Logo**: Upload file up to 10MB, PNG with transparent background recommended
  - Used in emails to customers, and in the strip at the top of booking pages (business name shown instead when there is no logo)
  - If uploaded, its colours are suggested as swatches in the Custom palette
- **Logo size in emails**: only shown once a logo is uploaded. Small (100px), Medium (150px), Large (225px), Jumbo (400px)
- **Default cover photo**: Upload file up to 10MB
  - Used for any resource or service without its own cover photo, and at the top of the booking website when the header image is shown
- **Show header image**: Toggle to show/hide the cover photo at the top of website and booking forms, including embedded forms. Turning it off keeps the uploaded photos
- **Colour palette**: Options shown as small tiles:
  - **Custom** (first tile): pick Brand colour and Accent colour from swatches or the browser colour picker. With a logo uploaded, its colours appear as swatches and a new custom palette starts from its two main colours; without one, "Get colours from your logo" asks the operator to upload it.
  - **Muddy**
  - **Frosty Paws**
  - **Pawsh Pink**
  - **Red Set Go!**
  - **Pumpkin Pup**
  - **Bark Mode**
  - **Noble Paws**
  - **Splashy Paws**
  - Applies to booking forms and admin area
  - Live preview under the tiles (sample booking page with the operator's business name, dates, time slots)
- **Save** button (reads "Save and continue" during onboarding, when the page is titled "Brand your booking pages")

## Manage URL (/settings/advanced)
- Lives on the Advanced settings page (Settings > Advanced > Advanced settings), not in Branding. That page also has Mute notifications and Opening date
- **Manage URL**: Text field for the customer booking management URL, the page where the operator embedded the manage component
- The Embeddable components page links to it

## Website Settings (/settings/website)
### Available Fields
- **Introduction**: Large text area "Describe your business"
  - Appears as website introduction
- **Website Gallery**: "Upload files" (several at once), up to 10MB each, no limit on the number of photos
  - Images displayed as gallery with lightbox
  - Each photo can be given a description (click it), reordered with arrow buttons, or removed with the bin button
- **Website URL**: Text field for the operator's own website ("The URL of your website."), must be a valid URL, max 255 characters
- **Facebook page**: when Facebook connection is available, a "Connect with Facebook" button. The operator signs in, then picks the page on "Choose your Facebook page" (click "Choose"). Pasting a link is rejected ("Connect your page with Facebook instead of pasting a link."). A linked page shows as a card with "View on Facebook" and "Clear". Only falls back to a plain link field when Facebook connection is not configured
- **Instagram handle**: Text field with @ prefix for Instagram handle
- **Save** button
- Page title: "Website settings". Description: "Editing this page will change the content on your Muddy-generated website."

## Navigation
- Both sections accessible from main Settings page
- Branding: "Manage your branding, including your logo and colour scheme"
- Website: "Change the content on your Muddy-generated website"
