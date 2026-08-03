import bcrypt from 'bcryptjs';
import { query } from '../config/database.js';

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    // Check if email is already taken by another user
    const existingUser = await query.get('SELECT * FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already in use by another user.' });
    }

    await query.run(
      'UPDATE users SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: userId,
        name,
        email,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile.', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }

  try {
    // Fetch current user details
    const user = await query.get('SELECT password_hash FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update database
    await query.run('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error updating password.', error: error.message });
  }
};

export const getBillingHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const payments = await query.all(
      `SELECT p.id, p.amount, p.payment_status, p.payment_gateway, p.transaction_id, p.created_at, pl.name as plan_name
       FROM payments p
       LEFT JOIN subscriptions s ON p.subscription_id = s.id
       LEFT JOIN membership_plans pl ON s.plan_id = pl.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.status(200).json(payments);
  } catch (error) {
    console.error('Get billing history error:', error);
    res.status(500).json({ message: 'Server error fetching billing history.', error: error.message });
  }
};
