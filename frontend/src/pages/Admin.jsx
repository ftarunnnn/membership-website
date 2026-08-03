import { useState, useEffect } from 'react';
import API from '../services/api';
import {
  ShieldCheck, Users, CreditCard, Play, FileCode,
  Lock, Trash2, ArrowUpRight, Ban, CheckCircle2, Loader2, Plus
} from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, totalRevenue: 0, totalPayments: 0 });
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for new content
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('video'); // video, article, pdf
  const [membershipLevel, setMembershipLevel] = useState('Free'); // Free, Pro, Premium
  const [contentUrl, setContentUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Active admin tab: stats, users, payments, content
  const [activeTab, setActiveTab] = useState('stats');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, paymentsRes, contentRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/admin/users'),
        API.get('/admin/payments'),
        API.get('/admin/content')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPayments(paymentsRes.data);
      setContents(contentRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await API.put('/admin/users/status', { userId, status: newStatus });
      fetchData(); // reload
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content item?')) return;
    try {
      await API.delete(`/admin/content/${contentId}`);
      fetchData(); // reload
    } catch (err) {
      alert('Failed to delete content.');
    }
  };

  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!title || !description || !contentUrl) {
      setErrorMsg('Please fill in all content parameters.');
      return;
    }

    setFormLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await API.post('/admin/content', {
        title,
        description,
        content_type: contentType,
        membership_level: membershipLevel,
        content_url: contentUrl
      });
      setSuccessMsg('New content catalog item published successfully.');
      setTitle('');
      setDescription('');
      setContentUrl('');
      fetchData(); // reload lists
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to publish content.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
      {/* Admin Title */}
      <section className="glass rounded-3xl p-6 border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-amber-500/10 p-3 border border-amber-500/20 text-amber-400">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-extrabold text-white">Administrator Control Panel</h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage user roles, inspect pricing payments, and release premium content.</p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 mb-8 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-4 px-6 border-b-2 transition-all ${
            activeTab === 'stats' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          General Statistics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 px-6 border-b-2 transition-all ${
            activeTab === 'users' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Manage Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-4 px-6 border-b-2 transition-all ${
            activeTab === 'payments' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Transaction Ledger ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-4 px-6 border-b-2 transition-all ${
            activeTab === 'content' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Content Catalog ({contents.length})
        </button>
      </div>

      {/* VIEW: STATS */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Total Registered Users</span>
                <span className="text-2xl font-black text-white">{stats.totalUsers}</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Active Premium Members</span>
                <span className="text-2xl font-black text-white">{stats.activeSubscribers}</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Gross Revenue (INR)</span>
                <span className="text-2xl font-black text-emerald-400">₹{stats.totalRevenue}</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Completed Transactions</span>
                <span className="text-2xl font-black text-white">{stats.totalPayments}</span>
              </div>
            </div>
          </div>

          <div className="glass border border-slate-800 rounded-2xl p-6 bg-slate-900/10">
            <h3 className="text-sm font-bold text-white mb-2">Platform Security Status</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              All backend endpoints require a valid JWT token verification signature. Administrator endpoints enforce double checks mapping roles metadata to verify admin rights. User inputs are sanitized and database queries utilize parameterized sqlite inputs.
            </p>
          </div>
        </div>
      )}

      {/* VIEW: USERS LIST */}
      {activeTab === 'users' && (
        <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-900 text-slate-400">
                <th className="p-4 font-semibold uppercase tracking-wider">User Details</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Active Plan</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Joined Date</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-right">Access Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-900/10">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{u.name}</div>
                    <div className="text-slate-400 mt-0.5">{u.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-400 font-semibold uppercase">
                      {u.active_plan || 'Free'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      u.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u.id, u.status)}
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-1.5 text-[10px] font-bold border transition-all ${
                        u.status === 'active'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                    >
                      <Ban className="h-3 w-3" /> {u.status === 'active' ? 'Block User' : 'Unblock User'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: PAYMENTS LIST */}
      {activeTab === 'payments' && (
        <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-900 text-slate-400">
                <th className="p-4 font-semibold uppercase tracking-wider">User Details</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Transaction Amount</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Gateway</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Timestamp</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-slate-900/10">
                  <td className="p-4">
                    <div className="font-bold text-white">{p.user_name}</div>
                    <div className="text-slate-500 mt-0.5 text-[10px]">{p.user_email}</div>
                  </td>
                  <td className="p-4 font-semibold text-white">₹{p.amount}</td>
                  <td className="p-4 uppercase text-[10px] text-slate-500 font-semibold">{p.payment_gateway.replace('_mock', '')}</td>
                  <td className="p-4 font-mono text-[10px] text-slate-400">{p.transaction_id}</td>
                  <td className="p-4 text-slate-400">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      {p.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: CONTENT LIST & CREATION FORM */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Release New Content Form */}
          <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Publish Lesson</h2>
              <p className="text-xs text-slate-500 font-medium">Add premium items to members catalogs.</p>
            </div>

            <form onSubmit={handleUploadContent} className="space-y-4">
              {successMsg && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., GraphQL API Design Principles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="e.g., Short breakdown of queries, mutations, resolvers structure..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Content Type</label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="video">Video Course</option>
                    <option value="article">Documentation</option>
                    <option value="pdf">Zip/PDF Code</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Access Plan Level</label>
                  <select
                    value={membershipLevel}
                    onChange={(e) => setMembershipLevel(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Free">Free Tier</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="Premium">Premium Plan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Source URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., YouTube embed URL or Github Zip link"
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors py-3 text-center text-xs font-semibold text-white flex items-center justify-center gap-1.5"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Releasing...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Publish Content
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Content Grid (Deleting Content) */}
          <div className="lg:col-span-2 space-y-4">
            {contents.map(c => (
              <div key={c.id} className="glass rounded-xl p-4 border border-slate-800 flex justify-between items-start gap-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[9px] font-semibold text-indigo-400 uppercase">
                      {c.membership_level} Plan
                    </span>
                    <span className="rounded bg-slate-900 border border-slate-850 px-2 py-0.5 text-[9px] font-semibold text-slate-400 uppercase">
                      {c.content_type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{c.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{c.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteContent(c.id)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
