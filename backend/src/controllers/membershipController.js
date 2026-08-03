import { query } from '../config/database.js';

export const getAllPlans = async (req, res) => {
  try {
    const plans = await query.all('SELECT * FROM membership_plans WHERE status = ? ORDER BY price ASC', ['active']);
    
    // Parse features if they are stored as JSON string
    const formattedPlans = plans.map(plan => {
      try {
        return { ...plan, features: JSON.parse(plan.features) };
      } catch (e) {
        return { ...plan, features: plan.features.split(',') };
      }
    });

    res.status(200).json(formattedPlans);
  } catch (error) {
    console.error('Fetch plans error:', error);
    res.status(500).json({ message: 'Server error fetching membership plans.', error: error.message });
  }
};

export const getProtectedContent = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    let activePlanName = 'Free'; // Default fallback

    if (userRole === 'admin') {
      activePlanName = 'Premium'; // Admins see everything
    } else {
      const activeSub = await query.get(
        `SELECT s.id, p.name as plan_name 
         FROM subscriptions s
         JOIN membership_plans p ON s.plan_id = p.id
         WHERE s.user_id = ? AND s.status = 'active'
         ORDER BY s.created_at DESC LIMIT 1`,
        [userId]
      );
      if (activeSub) {
        activePlanName = activeSub.plan_name;
      }
    }

    const contents = await query.all('SELECT * FROM content ORDER BY created_at DESC');
    
    // Check access level
    const levels = { 'Free': 0, 'Pro': 1, 'Premium': 2 };
    const userLevel = levels[activePlanName] ?? 0;

    const processedContents = contents.map(item => {
      const itemLevel = levels[item.membership_level] ?? 0;
      if (userLevel < itemLevel) {
        return {
          ...item,
          content_url: '#',
          isLocked: true
        };
      }
      return {
        ...item,
        isLocked: false
      };
    });
    
    res.status(200).json({
      activePlan: activePlanName,
      contents: processedContents
    });
  } catch (error) {
    console.error('Fetch protected content error:', error);
    res.status(500).json({ message: 'Server error fetching membership content.', error: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find active subscription
    const activeSub = await query.get(
      `SELECT s.id, p.name FROM subscriptions s 
       JOIN membership_plans p ON s.plan_id = p.id
       WHERE s.user_id = ? AND s.status = 'active'`,
      [userId]
    );

    if (!activeSub) {
      return res.status(400).json({ message: 'No active subscription found to cancel.' });
    }

    if (activeSub.name === 'Free') {
      return res.status(400).json({ message: 'Cannot cancel the Free tier.' });
    }

    // Cancel auto renewal or change status
    // For simplicity, let's mark it as 'cancelled' and downgrade user back to 'Free'
    await query.run("UPDATE subscriptions SET status = 'cancelled' WHERE id = ?", [activeSub.id]);

    // Re-subscribe them to Free plan
    const freePlan = await query.get("SELECT id FROM membership_plans WHERE name = 'Free'");
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 1);

    await query.run(
      'INSERT INTO subscriptions (user_id, plan_id, status, start_date, end_date, auto_renew) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, freePlan.id, 'active', startDate.toISOString(), endDate.toISOString(), 1]
    );

    res.status(200).json({ message: 'Subscription cancelled. Downgraded to Free tier.' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error cancelling subscription.', error: error.message });
  }
};
