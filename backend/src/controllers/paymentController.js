import { query } from '../config/database.js';

export const createOrder = async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  if (!planId) {
    return res.status(400).json({ message: 'Plan ID is required.' });
  }

  try {
    const plan = await query.get('SELECT * FROM membership_plans WHERE id = ?', [planId]);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    // Generate a unique mock order ID
    const mockOrderId = 'order_mock_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();

    res.status(200).json({
      message: 'Mock order created successfully.',
      orderId: mockOrderId,
      amount: plan.price,
      currency: 'INR',
      planId: plan.id,
      planName: plan.name
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ message: 'Server error generating order.', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { planId, transactionId, gateway } = req.body;
  const userId = req.user.id;

  if (!planId || !transactionId || !gateway) {
    return res.status(400).json({ message: 'Missing payment details: planId, transactionId, and gateway are required.' });
  }

  try {
    const plan = await query.get('SELECT * FROM membership_plans WHERE id = ?', [planId]);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    // 1. Mark existing active subscriptions as "upgraded"
    await query.run(
      "UPDATE subscriptions SET status = 'expired' WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    // 2. Create the new subscription
    const startDate = new Date();
    const endDate = new Date();
    if (plan.billing_period === 'yearly') {
      endDate.setDate(startDate.getDate() + 365);
    } else {
      endDate.setDate(startDate.getDate() + 30); // monthly / default
    }

    const subResult = await query.run(
      'INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date, auto_renew) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, plan.id, 'active', startDate.toISOString(), endDate.toISOString(), 1]
    );

    const subscriptionId = subResult.lastID;

    // 3. Log the payment details
    await query.run(
      'INSERT INTO payments (user_id, subscription_id, amount, payment_status, payment_gateway, transaction_id) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, subscriptionId, plan.price, 'completed', gateway, transactionId]
    );

    res.status(200).json({
      message: 'Payment verified and subscription activated successfully.',
      subscription: {
        id: subscriptionId,
        planName: plan.name,
        price: plan.price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error verifying payment.', error: error.message });
  }
};
