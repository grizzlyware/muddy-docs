# Muddy Booking Branding and Website Customization Structure

## Main Settings Access
- Settings main page: `/settings`
- Organized into sections: Business, Bookings, Pricing, Payments, Notifications, Advanced

## Branding Settings (/settings/branding)
### Available Fields
- **Logo**: Upload file up to 10MB, PNG with transparent background recommended
  - Used in emails to customers
  - If uploaded, Muddy can extract colours for the Custom palette ("Get colours from your logo")
- **Default Walk Cover Photo**: Upload file up to 10MB
  - Used when no cover photo is set for specific walks
- **Show header image**: Toggle to show/hide the cover photo at the top of website and booking forms
- **Colour palette**: Options shown as small tiles:
  - **Custom** (first tile): pick Brand colour and Accent colour via colour picker (swatches, hue slider, eyedropper, RGB). "Get colours from your logo" appears if logo is uploaded.
  - **Muddy**
  - **Frosty Paws**
  - **Pawsh Pink**
  - **Red Set Go!**
  - **Bark Mode**
  - **Noble Paws**
  - **Splashy Paws**
  - **Pumpkin Pup**
  - Applies to booking forms and admin area
  - Live preview shown (sample booking page: "Example Operator", dates, time slots)
- **Manage URL**: Text field for customer booking management URL

## Website Settings (/settings/website)
### Available Fields
- **Introduction**: Large text area "Describe your business"
  - Appears as website introduction
- **Website Gallery**: Image upload up to 10MB
  - Images displayed as gallery with lightbox
- **Facebook URL**: Text field for Facebook page URL
- **Instagram handle**: Text field with @ prefix for Instagram handle

## Navigation
- Both sections accessible from main Settings page
- Branding: "Manage your branding, including your logo and colour scheme"
- Website: "Change the content on your Muddy-generated website"

## Update History
- Issue #83 (Nov 2026): Custom palette added; Splashy Paws preset added; live preview added
