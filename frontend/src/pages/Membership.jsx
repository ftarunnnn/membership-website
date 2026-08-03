import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { CreditCard, Calendar, CheckCircle2, ShieldAlert, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Membership = () => {
  const { subscription, refreshUser } = useAuth();
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await API.get('/users/billing');
        setBilling(res.data);
      } catch (err) {
        console.error('Error fetching billing data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  const handleCancelSub = async () => {
    if (!window.confirm('Are you sure you want to cancel your membership? You will be downgraded to the Free tier immediately.')) {
      return;
    }

    setCancelLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await API.post('/membership/cancel');
      await refreshUser();
      setSuccessMsg(res.data.message);
      // Refresh billing list
      const billingRes = await API.get('/users/billing');
      setBilling(billingRes.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to cancel subscription.');
    } finally {
      setCancelLoading(false);
    }
  };

  const getPlanDetails = () => {
    if (!subscription) {
      return { name: 'Free', price: 0, date: 'Never' };
    }
    return {
      name: subscription.plan_name,
      price: subscription.plan_price,
      date: new Date(subscription.end_date).toLocaleDateString()
    };
  };

  const planInfo = getPlanDetails();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8">
      {/* Title */}
      <div className="mb-8 border-b border-slate-900 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Membership Details</h1>
        <p className="text-slate-400 text-xs mt-1">Review active plans, expiration states, and billing invoices.</p>
      </div>

      {successMsg && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 mb-6 flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 mb-6 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4" /> {errorMsg}
        </div>
      )}

      {/* Current Active Plan Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-stretch">
        
        <div className="glass rounded-2xl p-6 border border-slate-800 flex flex-col justify-between md:col-span-2">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400">Subscription status</span>
            <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              Active Tier: <span className="text-indigo-400">{planInfo.name}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Your {planInfo.name} tier plan gives you access to premium materials matching your plan requirements.
            </p>
          </div>
          
          <div className="flex gap-6 mt-6 border-t border-slate-900 pt-4 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="h-4 w-4 text-indigo-500" /> Expiry Date: <span className="text-white font-semibold">{planInfo.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <CreditCard className="h-4 w-4 text-indigo-500" /> Amount: <span className="text-white font-semibold">₹{planInfo.price}/mo</span>
            </div>
          </div>
        </div>

        {/* Upgrade / Cancel Sidebar Card */}
        <div className="glass rounded-2xl p-6 border border-slate-850 bg-slate-900/30 flex flex-col justify-center items-center text-center space-y-4">
          {planInfo.name === 'Free' ? (
            <>
              <h3 className="text-sm font-bold text-slate-200">Ready to unlock premium content?</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">Get access to custom projects, course archives, and microservices databases.</p>
              <Link
                to="/pricing"
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors py-2.5 text-center text-xs font-semibold text-white inline-flex items-center justify-center gap-1"
              >
                Upgrade Plan <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-sm font-bold text-slate-200">Want to close membership?</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">You will lose access to premium lessons and files immediately upon canceling.</p>
              <button
                onClick={handleCancelSub}
                disabled={cancelLoading}
                className="w-full rounded-xl bg-slate-950 border border-slate-850 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all py-2.5 text-center text-xs font-semibold text-white flex items-center justify-center gap-1"
              >
                {cancelLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Downgrading...
                  </>
                ) : (
                  'Cancel Membership'
                )}
              </button>
            </>
          )}
        </div>

      </div>

      {/* Payments History Table */}
      <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-900">
          <h2 className="text-sm font-bold text-white">Payment Transaction History</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Logs of all payments made to your profile subscription.</p>
        </div>

        {billing.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No payments have been recorded for this user profile yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-900 text-slate-400">
                  <th className="p-4 font-semibold uppercase tracking-wider">Plan Name</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Amount</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Gateway</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Transaction ID</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {billing.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-900/20">
                    <td className="p-4 font-bold text-white">{pay.plan_name}</td>
                    <td className="p-4">₹{pay.amount}</td>
                    <td className="p-4 uppercase text-[10px] text-slate-500 font-semibold">{pay.payment_gateway.replace('_mock', '')}</td>
                    <td className="p-4 font-mono text-[10px] text-slate-400">{pay.transaction_id}</td>
                    <td className="p-4">{new Date(pay.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        pay.payment_status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {pay.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;
