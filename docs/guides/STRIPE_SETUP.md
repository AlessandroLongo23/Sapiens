# Stripe Subscription Integration Guide

## Overview
This guide will help you set up Stripe subscriptions for your SvelteKit application. The integration supports 4 subscription tiers: Free, Lite, Base, and Pro.

## Table of Contents
1. [Subscription Plans](#subscription-plans)
2. [Stripe Account Setup](#stripe-account-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Schema](#database-schema)
5. [Webhook Configuration](#webhook-configuration)
6. [Testing](#testing)
7. [Going Live](#going-live)

---

## Subscription Plans

### 1. Piano Free (€0/month)
- ✅ Access to theory
- ✅ Basic educational materials
- ✅ Email support
- ❌ No exercises
- ❌ No AI chat
- ❌ No tutoring

### 2. Piano Lite (€4.99/month)
- ✅ Everything in Free
- ✅ Interactive exercises
- ✅ Complete formula sheets
- ✅ Statistics and progress tracking
- ❌ No AI chat
- ❌ No tutoring

### 3. Piano Base (€19.99/month) ⭐ Most Popular
- ✅ Everything in Lite
- ✅ **Sapiens AI - Unlimited chat**
- ✅ Priority support
- ✅ Advanced materials
- ❌ No tutoring

### 4. Piano Pro (€49.99/month)
- ✅ Everything in Base
- ✅ **1-on-1 tutoring (2h/month)**
- ✅ Custom calendar
- ✅ 24/7 dedicated support
- ✅ Exclusive materials

---

## Stripe Account Setup

### Step 1: Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a new account
3. Complete the account verification process

### Step 2: Create Products and Prices

#### Option A: Using Stripe Dashboard (Recommended for beginners)

1. **Navigate to Products**
   - Log in to [Stripe Dashboard](https://dashboard.stripe.com)
   - Go to **Products** → **Add product**

2. **Create Piano Lite**
   - Name: `Piano Lite`
   - Description: `Accesso a esercizi, formulari e statistiche`
   - Pricing model: `Recurring`
   - Price: `€4.99`
   - Billing period: `Monthly`
   - Click **Save product**
   - Copy the **Price ID** (starts with `price_...`)

3. **Create Piano Base**
   - Name: `Piano Base`
   - Description: `Include Sapiens AI e supporto prioritario`
   - Price: `€19.99`
   - Billing period: `Monthly`
   - Copy the **Price ID**

4. **Create Piano Pro**
   - Name: `Piano Pro`
   - Description: `Include ripetizioni personalizzate e supporto dedicato`
   - Price: `€49.99`
   - Billing period: `Monthly`
   - Copy the **Price ID**

#### Option B: Using Stripe CLI (Advanced)

```bash
# Install Stripe CLI
# Windows (using Scoop): scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Or download from: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Create products
stripe products create --name="Piano Lite" --description="Accesso a esercizi, formulari e statistiche"
stripe prices create --product=<PRODUCT_ID> --amount=999 --currency=eur --recurring[interval]=month

stripe products create --name="Piano Base" --description="Include Sapiens AI e supporto prioritario"
stripe prices create --product=<PRODUCT_ID> --amount=1999 --currency=eur --recurring[interval]=month

stripe products create --name="Piano Pro" --description="Include ripetizioni personalizzate"
stripe prices create --product=<PRODUCT_ID> --amount=4999 --currency=eur --recurring[interval]=month
```

### Step 3: Get Your API Keys

1. Go to **Developers** → **API keys**
2. You'll see:
   - **Publishable key** (starts with `pk_test_...` for test mode)
   - **Secret key** (starts with `sk_test_...` for test mode)
   - Click "Reveal test key" to see the secret key

---

## Environment Configuration

Create a `.env` file in your project root:

```env
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Stripe Price IDs
STRIPE_PRICE_LITE=price_your_lite_price_id_here
STRIPE_PRICE_BASE=price_your_base_price_id_here
STRIPE_PRICE_PRO=price_your_pro_price_id_here

# OpenAI API Key (for Sapiens AI)
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** Never commit your `.env` file to version control!

---

## Database Schema

Add these columns to your `students` table in Supabase:

```sql
-- Add subscription columns to students table
ALTER TABLE students
ADD COLUMN subscription_plan TEXT DEFAULT 'free',
ADD COLUMN subscription_status TEXT DEFAULT 'active',
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN subscription_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX idx_students_stripe_customer ON students(stripe_customer_id);
CREATE INDEX idx_students_subscription ON students(subscription_plan, subscription_status);
```

### Column Descriptions:
- `subscription_plan`: Current plan (`free`, `lite`, `base`, or `pro`)
- `subscription_status`: Subscription status (`active`, `trialing`, `past_due`, `canceled`)
- `stripe_customer_id`: Stripe Customer ID for managing subscriptions
- `subscription_updated_at`: Last time the subscription was updated

---

## Webhook Configuration

Webhooks allow Stripe to notify your app about subscription events (payments, cancellations, etc.).

### Local Development (Using Stripe CLI)

1. **Install Stripe CLI** (if not already installed)

2. **Forward webhooks to your local server:**
   ```bash
   stripe listen --forward-to http://localhost:5173/api/stripe/webhook
   ```

3. **Copy the webhook signing secret** (starts with `whsec_...`)
   - Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

### Production Deployment

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your production URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and add it to your production environment variables

---

## Testing

### Test Mode
Stripe provides test cards for testing payments:

#### Successful Payment
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

#### Failed Payment
- Card number: `4000 0000 0000 0002`

#### Requires Authentication (3D Secure)
- Card number: `4000 0025 0000 3155`

### Testing the Flow

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Start webhook forwarding:**
   ```bash
   stripe listen --forward-to http://localhost:5173/api/stripe/webhook
   ```

3. **Test the subscription flow:**
   - Log in as a student
   - Navigate to `/student/subscription`
   - Select a plan
   - Use test card `4242 4242 4242 4242`
   - Complete checkout
   - Verify subscription is activated in your database

4. **Test access control:**
   - Try accessing `/student/chat` with free plan → Should show upgrade prompt
   - Upgrade to Base plan
   - Try accessing `/student/chat` again → Should work

---

## Going Live

### 1. Switch to Live Mode

In Stripe Dashboard:
1. Toggle from **Test mode** to **Live mode** (top right)
2. Go to **Developers** → **API keys**
3. Get your **live API keys**:
   - Publishable key (starts with `pk_live_...`)
   - Secret key (starts with `sk_live_...`)

### 2. Update Environment Variables

Update your production `.env` with live keys:
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

### 3. Configure Live Webhook

1. Create a new webhook endpoint in **Live mode**
2. Use your production URL
3. Update `STRIPE_WEBHOOK_SECRET` with the live signing secret

### 4. Activate Your Stripe Account

Before accepting real payments:
1. Complete your Stripe account verification
2. Provide business information
3. Set up your bank account for payouts
4. Enable payment methods (card, Apple Pay, Google Pay, etc.)

### 5. Test in Production

1. Use a real card to test the complete flow
2. Immediately refund the test payment in Stripe Dashboard
3. Verify webhooks are being received correctly

---

## Subscription Management

### Customer Portal

Students can manage their subscriptions through the Stripe Customer Portal:
- Update payment method
- Change subscription plan
- View invoices
- Cancel subscription

Access: Click "Gestisci abbonamento" on `/student/subscription` page

### Features by Plan

The integration automatically checks subscription access for features:

```javascript
import { checkFeatureAccess } from '$lib/utils/subscription.js';

// In your +page.server.js
export const load = async ({ locals: { user } }) => {
  const hasAccess = checkFeatureAccess(user, 'ai_chat');
  return { hasAccess };
};
```

Available features:
- `theory` - Access to theoretical materials
- `exercises` - Interactive exercises
- `ai_chat` - Sapiens AI chat
- `tutoring` - 1-on-1 tutoring sessions

---

## Troubleshooting

### Webhook Events Not Received

**Problem:** Subscriptions not updating in your database

**Solutions:**
1. Check webhook signing secret is correct
2. Verify webhook endpoint is accessible
3. Check Stripe Dashboard → Webhooks → View logs
4. Ensure your webhook endpoint returns 200 status

### Checkout Session Not Redirecting

**Problem:** After payment, user not redirected back

**Solutions:**
1. Check `success_url` and `cancel_url` are correct
2. Verify your domain is in allowed domains (Stripe Dashboard → Settings → Branding)
3. Check browser console for errors

### Database Not Updating

**Problem:** Subscription status not reflecting in app

**Solutions:**
1. Check database columns exist
2. Verify Supabase connection
3. Check webhook logs for errors
4. Ensure user metadata is being refreshed

### "Invalid Price ID" Error

**Problem:** Cannot create checkout session

**Solutions:**
1. Verify price IDs are correct in `.env`
2. Ensure you're using test price IDs in test mode
3. Check that products exist in your Stripe account

---

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Validate webhook signatures** (already implemented)
3. **Use HTTPS** in production
4. **Store customer IDs securely** in your database
5. **Implement rate limiting** on checkout endpoints
6. **Log all subscription events** for audit trails

---

## Cost Estimates

### Stripe Fees (Europe)
- **Card payments:** 1.5% + €0.25 per transaction
- **SEPA Direct Debit:** €0.35 per transaction
- **No setup fees or monthly fees**

### Monthly Revenue Examples

If you have:
- 10 Lite subscribers: €99.90/month
- 25 Base subscribers: €499.75/month
- 5 Pro subscribers: €249.95/month
- **Total:** €849.60/month
- **Stripe fees:** ~€15-20/month
- **Net revenue:** ~€830/month

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)

---

## Support

For issues with:
- **Stripe Integration:** Check [Stripe Support](https://support.stripe.com)
- **Code Implementation:** Review the code in `src/lib/stripe/` and `src/routes/api/stripe/`
- **Database Issues:** Check Supabase logs and documentation

---

## Next Steps

After completing the Stripe setup:

1. ✅ Test the complete subscription flow
2. ✅ Add email notifications for subscription events
3. ✅ Implement usage tracking (for Pro plan tutoring hours)
4. ✅ Add analytics to track conversions
5. ✅ Create a marketing page explaining the plans
6. ✅ Set up invoice customization with your branding

Good luck with your subscription platform! 🚀

