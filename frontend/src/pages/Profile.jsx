import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User, Lock, Mail, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  
  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setProfileError('Name and email are required.');
      return;
    }

    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      await API.put('/users/profile', { name, email });
      await refreshUser();
      setProfileSuccess('Profile details updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile details.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setPassLoading(true);
    setPassError('');
    setPassSuccess('');

    try {
      await API.put('/users/password', { currentPassword, newPassword });
      setPassSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8">
      {/* Page Title */}
      <div className="mb-8 border-b border-slate-900 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Account Settings</h1>
        <p className="text-slate-400 text-xs mt-1">Configure profile credentials, security passwords, and subscription details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Profile Details Form */}
        <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Profile Details</h2>
            <p className="text-xs text-slate-500">Update your account name and email address.</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {profileSuccess && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" /> {profileError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 text-center text-xs font-semibold text-white flex items-center justify-center gap-1.5"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving Changes...
                </>
              ) : (
                'Save Profile Details'
              )}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Security & Password</h2>
            <p className="text-xs text-slate-500">Modify your login password credentials.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {passSuccess && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {passSuccess}
              </div>
            )}
            {passError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" /> {passError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="w-full rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 transition-colors py-3 text-center text-xs font-semibold text-white flex items-center justify-center gap-1.5"
            >
              {passLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Modifying Security...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>

      </div>

      {/* Subscription & Billing Quick Link Section */}
      <div className="mt-8 glass rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-950 to-slate-900/60">
        <div>
          <h3 className="text-sm font-bold text-white">Membership Billing & Subscriptions</h3>
          <p className="text-xs text-slate-400">View transactions, cancel automatic renewals, or download billing invoices.</p>
        </div>
        <Link
          to="/membership"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2.5 text-xs font-semibold text-white inline-flex items-center gap-1"
        >
          Manage Membership <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default Profile;
