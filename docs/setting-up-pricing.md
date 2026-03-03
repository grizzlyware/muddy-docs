# Setting Up Pricing in Muddy Booking

This guide will walk you through setting up pricing for your dog walking business in Muddy Booking, including business-level pricing, walk-specific pricing, and advanced price adjustments.

## Quick Start

From your dashboard, you'll see a "Set up pricing" task in the quick start section. This is the fastest way to get started with basic pricing configuration.

![dashboard-with-pricing-task](../screenshots/01-dashboard-with-pricing-task.png)

## Business-Level Pricing Setup

### Accessing Pricing Settings

You can access pricing settings in two ways:

1. **From the dashboard**: Click the "Set up pricing" quick task
2. **From Settings**: Navigate to Settings > Pricing section

The main pricing page is located at: `/manage/operators/{id}/pricing`

![pricing-main-page](../screenshots/02-pricing-main-page.png)

### Basic Pricing Configuration

#### Duration-Based Pricing

Muddy Booking uses duration-based pricing where each walk length (e.g., 1 hour, 30 minutes) has its own pricing structure. By default, you'll see a "1 hour" duration configured.

#### Core Pricing Fields

For each duration, you can configure:

1. **Base Price** (Default: £8.00)
   - The base price that includes a certain number of dogs
   - Default includes the first 2 dogs
   - This is your starting price point

2. **Price Per Extra Dog** (Default: £1.00)
   - Additional charge for each dog beyond the included number
   - Applied per dog above the base number

3. **Extra Dogs Surcharge** (Default: £0.00)
   - One-time flat fee when the booking exceeds the included dog count
   - Applied once regardless of how many extra dogs

4. **Total Included Dogs** (Default: 2)
   - Number of dogs included in the base price
   - You can adjust this based on your business model

5. **Prices Include Tax**
   - Toggle to specify whether your displayed prices include tax
   - Choose "Yes" or "No" based on your tax reporting needs

### Adding Multiple Durations

To offer different walk lengths:

1. Click the **"Add duration"** button
2. A new pricing block will appear for you to configure
3. Set up pricing for each duration independently
4. Use the **"Delete this duration"** button to remove unwanted durations

### Commercial Pricing

Enable the **"Separate commercial price?"** toggle if you want to offer different pricing for commercial vs. private customers.

![pricing-with-commercial-toggle](../screenshots/03-pricing-with-commercial-toggle.png)

### Saving Your Pricing

Click **"Save all pricing configurations"** to save all your pricing settings across all durations.

## Walk-Specific Pricing

### Default Behavior

By default, all walks inherit pricing from your business-level settings. This ensures consistency across your service offerings.

![walk-specific-pricing-default](../screenshots/13-walk-specific-pricing-default.png)

### Setting Up Walk-Specific Pricing

If you need different pricing for specific walks:

1. Navigate to **Walks** in the main menu
2. Select the specific walk you want to configure
3. Click **"Settings"** for that walk
4. Select **"Pricing"** from the walk settings menu
5. Click **"Setup specific prices for this walk"**

![walk-specific-pricing-setup](../screenshots/14-walk-specific-pricing-setup.png)

Walk-specific pricing uses the same configuration options as business-level pricing:
- Duration-based pricing blocks
- Base price, extra dog pricing, and surcharges
- Tax inclusion settings
- Commercial pricing toggle

### Reverting to Business Pricing

To return a walk to using business-level pricing:
1. Delete all duration blocks for that walk
2. Click "Save all pricing configurations"
3. The walk will revert to inheriting business pricing

## Advanced Price Adjustments

Access advanced pricing features at: `/manage/operators/{id}/price-adjustments`

![price-adjustments-page](../screenshots/07-price-adjustments-page.png)

### Types of Price Adjustments

You can create two types of adjustments:

1. **Discounts** - Reduce booking prices
2. **Surcharges** - Add to booking prices

### Creating Price Adjustments

Click **"Create"** to set up a new price adjustment.

![create-price-adjustment](../screenshots/08-create-price-adjustment.png)

#### Basic Configuration

1. **Adjustment Kind**: Choose between Discount or Surcharge
2. **Name**: Internal identifier for the adjustment
3. **Valid Dates**: 
   - Set start date (can be immediate or future)
   - Choose to run indefinitely or set an end date
4. **Type**: Select percentage or fixed amount
5. **Value**: Set the discount percentage or fixed amount
6. **Active Status**: Enable or disable the adjustment

#### Advanced Options

![create-price-adjustment-lower-section](../screenshots/09-create-price-adjustment-lower-section.png)

- **Apply Automatically**: Automatically apply to qualifying bookings
- **Apply to Original Price**: Calculate based on original price vs. previously adjusted price
- **Discount Codes**: Create codes customers can use to apply discounts
- **Adjustment Ordering**: Set priority when multiple adjustments apply

### Discount Codes

You can create discount codes for customers:

1. **Manual Codes**: Type specific codes for customers
2. **Generate Codes**: Use the "Generate" button for random codes
3. **Code Requirements**: Must be unique and contain only letters and numbers

### Conditional Rules

Price adjustments can be applied conditionally using rules:

![price-adjustment-with-rule-added](../screenshots/10-price-adjustment-with-rule-added.png)

Available rule types include:

**Existing Adjustments:**
- Must have no discounts
- Must have no surcharges

**Timing Rules:**
- Start time at or before/after specific time
- After last light / Before first light
- On or after/before specific dates
- Specific days of the week

**Booking Characteristics:**
- Price equal or above/below threshold
- Minimum/maximum dogs in booking
- Minimum/maximum bookings in group
- Specific walks (include/exclude)

**Customer Rules:**
- Customer group membership
- Not in specific customer groups

**Booking Types:**
- Rescheduled bookings
- Replacement bookings
- Original bookings

### Rule Management

1. Click **"Add rule"** to create conditional logic
2. Select from the dropdown of available rule types
3. Configure the specific parameters for each rule
4. Use **"Close"** to cancel or **"Add"** to confirm

## Best Practices

### Getting Started
1. **Start Simple**: Begin with basic business-level pricing for all walks
2. **Test Your Pricing**: Use the preview functionality to see how prices appear to customers
3. **Set Clear Policies**: Decide on your tax inclusion approach before launch

### Scaling Your Pricing
1. **Use Walk-Specific Pricing**: Only when walks genuinely require different pricing
2. **Leverage Price Adjustments**: For seasonal promotions, loyalty discounts, or special offers
3. **Monitor and Adjust**: Use the booking stats to evaluate your pricing effectiveness

### Managing Complexity
1. **Document Your Rules**: Keep track of active price adjustments and their purposes
2. **Regular Review**: Periodically review and clean up unused price adjustments
3. **Clear Communication**: Ensure your pricing is clearly communicated to customers

## Settings Overview

For reference, pricing-related settings can be found in several locations:

![settings-overview](../screenshots/06-settings-overview.png)

- **Main Pricing**: Settings > Pricing (business-level pricing and durations)
- **Price Adjustments**: Settings > Price adjustments (discounts, surcharges, and rules)
- **Walk-Specific**: Individual walk settings > Pricing

## Troubleshooting

**Pricing Not Updating**: Ensure you click "Save all pricing configurations" after making changes.

**Walk Not Using Business Pricing**: Check if the walk has specific pricing configured. Delete all walk durations to revert to business pricing.

**Discounts Not Applying**: Verify the discount is active, within date range, and meets all rule conditions.

**Multiple Adjustments Conflicting**: Use the adjustment ordering feature to control the sequence of application.

This comprehensive pricing setup will help you create a flexible, profitable pricing structure for your dog walking business while maintaining the ability to offer targeted promotions and walk-specific pricing when needed.