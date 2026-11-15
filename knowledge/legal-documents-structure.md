# Muddy Booking Legal Documents Structure

## URL and Location
- Main URL: `/settings/legal`
- Navigation: Settings → Business → Legal
- Page title: "Legal settings"

## Legal Document Types
1. **Terms & conditions**: Free-form text area for business rules and guidelines
2. **Privacy policy**: Free-form text area for data usage and protection policies  
3. **Cancellation policy**: Can be manual (text area) OR automated (generated from settings)

## Key Features
- **Automate cancellation policy**: Toggle switch that automatically generates and keeps cancellation policy updated based on booking settings
- When automation is ON: Cancellation policy text area is hidden (automatically generated)
- When automation is OFF: Manual cancellation policy text area is shown
- **Require acceptance**: Toggle switch to require users to accept policies before booking, customer sign-up and shop checkout (only enforced when the business has at least one legal document)
- All changes saved with single "Save" button

## Text Areas
- All text areas use placeholder text "Enter your text here"
- Markdown editor fields (MarkdownInput), multi-line
- No character limit in validation (nullable string)

## Policy Integration
- Policies are presented to customers during the booking process
- "Require acceptance" setting controls whether customers must explicitly agree
- Includes banned breeds policies if specified elsewhere in the system (banned breeds is a legal document type too, but it's managed from Settings > Banned breeds, not this page)
- Automated cancellation policy is generated from each offering's cancellation notice period (one shared period if they all match)