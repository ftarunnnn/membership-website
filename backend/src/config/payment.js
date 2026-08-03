import dotenv from 'dotenv';
dotenv.config();

// Mock gateway credentials
export const paymentConfig = {
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId123456789',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'mockSecret123456789',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mockSecretKey123456789',
};

// Simulated webhook signature validator
export const verifyWebhookSignature = (payload, signature, secret) => {
  // In a real application, you would use crypto.createHmac for Razorpay or stripe.webhooks.constructEvent for Stripe.
  // For simulation, we return true if the signature exists and is valid.
  if (!signature) return false;
  return true;
};
