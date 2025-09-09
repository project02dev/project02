# Payment Gateway Setup Guide

This guide explains how to set up the payment gateways for Project02.

## Quick Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your payment gateway credentials** to `.env.local`

## Payment Gateway Configuration

### 1. Paystack (Recommended for Nigeria/Africa)

1. **Sign up**: Go to [paystack.com](https://paystack.com) and create an account
2. **Get API Keys**: 
   - Go to Settings > API Keys & Webhooks
   - Copy your Test/Live Secret Key and Public Key
3. **Add to `.env.local`**:
   ```env
   PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
   ```

### 2. Stripe (Global)

1. **Sign up**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**:
   - Go to Developers > API Keys
   - Copy your Secret Key and Publishable Key
3. **Add to `.env.local`**:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_public_key_here
   ```

### 3. Flutterwave (Africa)

1. **Sign up**: Go to [flutterwave.com](https://flutterwave.com) and create an account
2. **Get API Keys**:
   - Go to Settings > API Keys
   - Copy your Secret Key and Public Key
3. **Add to `.env.local`**:
   ```env
   FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_secret_key_here
   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_public_key_here
   ```

### 4. PayPal (Global)

1. **Sign up**: Go to [developer.paypal.com](https://developer.paypal.com) and create an account
2. **Create App**:
   - Go to My Apps & Credentials
   - Create a new app
   - Copy Client ID and Client Secret
3. **Add to `.env.local`**:
   ```env
   PAYPAL_CLIENT_ID=your_client_id_here
   PAYPAL_CLIENT_SECRET=your_client_secret_here
   ```

## Testing

### Test Cards

**Paystack Test Cards:**
- Successful: `4084084084084081`
- Declined: `4084084084084081` (with CVV 408)

**Stripe Test Cards:**
- Successful: `4242424242424242`
- Declined: `4000000000000002`

**Flutterwave Test Cards:**
- Successful: `5531886652142950`
- PIN: `3310`
- OTP: `12345`

### Test Flow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test payment flow**:
   - Go to any project page
   - Click "Buy Now"
   - Select a payment method
   - Use test card details
   - Complete the payment

3. **Verify**:
   - Check the payment callback page
   - Verify order creation in Firebase
   - Check notifications

## Production Setup

### 1. Switch to Live Keys

Replace all test keys with live keys in your production environment:

```env
# Production Paystack
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key

# Production Stripe
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_live_public_key
```

### 2. Configure Webhooks

Set up webhooks for real-time payment notifications:

**Paystack Webhook URL**: `https://yourdomain.com/api/webhooks/paystack`
**Stripe Webhook URL**: `https://yourdomain.com/api/webhooks/stripe`

### 3. SSL Certificate

Ensure your production site has a valid SSL certificate for secure payments.

## Troubleshooting

### Common Issues

1. **404 Error on Payment APIs**:
   - Ensure API routes are created in `app/api/payments/`
   - Check file naming: `route.ts` not `route.js`

2. **Environment Variables Not Loading**:
   - Restart the development server after adding new env vars
   - Check `.env.local` file exists and has correct format

3. **CORS Errors**:
   - Ensure your domain is whitelisted in payment gateway settings
   - Check API endpoint URLs are correct

4. **Payment Verification Fails**:
   - Verify webhook URLs are correctly configured
   - Check payment gateway dashboard for failed transactions

### Support

- **Paystack**: [support@paystack.com](mailto:support@paystack.com)
- **Stripe**: [support@stripe.com](mailto:support@stripe.com)
- **Flutterwave**: [support@flutterwave.com](mailto:support@flutterwave.com)
- **PayPal**: [developer.paypal.com/support](https://developer.paypal.com/support)

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor payment gateway dashboards for suspicious activity
- Implement rate limiting on payment endpoints
