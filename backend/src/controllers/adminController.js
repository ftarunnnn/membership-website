import { query } from '../config/database.js';

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await query.get("SELECT COUNT(*) as count FROM users WHERE role != 'admin'");
    
    const activeSubscribers = await query.get(
      `SELECT COUNT(DISTINCT s.user_id) as count FROM subscriptions s
       JOIN membership_plans p ON s.plan_id = p.id
       WHERE s.status = 'active' AND p.price > 0`
    );

    const totalRevenue = await query.get("SELECT SUM(amount) as sum FROM payments WHERE payment_status = 'completed'");
    
    const paymentRecords = await query.get("SELECT COUNT(*) as count FROM payments");

    res.status(200).json({
      totalUsers: totalUsers.count,
      activeSubscribers: activeSubscribers.count,
      totalRevenue: totalRevenue.sum || 0,
      totalPayments: paymentRecords.count
    });
  } catch (error) {
    console.error('Fetch admin analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics.', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await query.all(
      `SELECT u.id, u.name, u.email, u.role, u.status, u.created_at,
       (SELECT p.name FROM subscriptions s JOIN membership_plans p ON s.plan_id = p.id WHERE s.user_id = u.id AND s.status = 'active' LIMIT 1) as active_plan
       FROM users u
       WHERE u.role != 'admin'
       ORDER BY u.created_at DESC`
    );
    res.status(200).json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Server error fetching user list.', error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({ message: 'User ID and status are required.' });
  }

  if (status !== 'active' && status !== 'blocked') {
    return res.status(400).json({ message: "Status must be 'active' or 'blocked'." });
  }

  try {
    const user = await query.get('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot update status of administrator accounts.' });
    }

    await query.run('UPDATE users SET status = ? WHERE id = ?', [status, userId]);

    res.status(200).json({ message: `User account is now ${status}.` });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error updating user status.', error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await query.all(
      `SELECT p.id, p.amount, p.payment_status, p.payment_gateway, p.transaction_id, p.created_at,
       u.name as user_name, u.email as user_email
       FROM payments p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    res.status(200).json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ message: 'Server error fetching payments list.', error: error.message });
  }
};

export const getAllContent = async (req, res) => {
  try {
    const content = await query.all('SELECT * FROM content ORDER BY created_at DESC');
    res.status(200).json(content);
  } catch (error) {
    console.error('Fetch all content error:', error);
    res.status(500).json({ message: 'Server error fetching content.', error: error.message });
  }
};

export const createContent = async (req, res) => {
  const { title, description, content_type, membership_level, content_url } = req.body;

  if (!title || !description || !content_type || !membership_level || !content_url) {
    return res.status(400).json({ message: 'All content fields are required.' });
  }

  try {
    const contentResult = await query.run(
      'INSERT INTO content (title, description, content_type, membership_level, content_url) VALUES (?, ?, ?, ?, ?)',
      [title, description, content_type, membership_level, content_url]
    );

    res.status(201).json({
      message: 'Content uploaded successfully.',
      content: {
        id: contentResult.lastID,
        title,
        description,
        content_type,
        membership_level,
        content_url
      }
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error creating content.', error: error.message });
  }
};

export const deleteContent = async (req, res) => {
  const { contentId } = req.params;

  if (!contentId) {
    return res.status(400).json({ message: 'Content ID is required.' });
  }

  try {
    const result = await query.run('DELETE FROM content WHERE id = ?', [contentId]);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Content item not found.' });
    }

    res.status(200).json({ message: 'Content deleted successfully.' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error deleting content.', error: error.message });
  }
};
