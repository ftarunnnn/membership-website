import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import PricingCard from '../components/PricingCard';
import { CreditCard, ShieldCheck, X, Check, Loader2 } from 'lucide-react';

const Pricing = () => {
  const { user, subscription, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  
  // Checkout Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/membership/plans');
        setPlans(res.data);
      } catch (err) {
        console.error('Error fetching plans:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!user) {
      // Redirect to register/login first
      navigate('/login?redirect=pricing');
      return;
    }

    if (plan.price === 0) {
      // Free plan selected - activate instantly
      handleFreeUpgrade(plan.id);
      return;
    }

    setSelectedPlan(plan);
    setShowCheckoutModal(true);
    setCheckoutError('');
    setCheckoutSuccess(false);
  };

  const handleFreeUpgrade = async (planId) => {
    setLoading(true);
    try {
      // Free tier doesn't require card details, simulate immediate transaction
      const transactionId = 'txn_free_' + Math.random().toString(36).substr(2, 9);
      await API.post('/payments/verify', {
        planId,
        transactionId,
        gateway: 'system'
      });
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Error upgrading to free plan:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setCheckoutError('Please fill in all credit card details.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError('');

    try {
      // 1. Create order on backend
      const orderRes = await API.post('/payments/create-order', { planId: selectedPlan.id });
      const { orderId } = orderRes.data;

      // 2. Simulate network delay for verification
      setTimeout(async () => {
        try {
          const transactionId = 'txn_mock_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
          
          // 3. Verify payment on backend
          await API.post('/payments/verify', {
            planId: selectedPlan.id,
            transactionId,
            gateway: 'stripe_mock'
          });

          // 4. Update local user state
          await refreshUser();
          
          setCheckoutSuccess(true);
          setCheckoutLoading(false);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            setShowCheckoutModal(false);
            navigate('/dashboard');
          }, 2000);

        } catch (verifyErr) {
          setCheckoutLoading(false);
          setCheckoutError(verifyErr.response?.data?.message || 'Payment verification failed.');
        }
      }, 1500);

    } catch (orderErr) {
      setCheckoutLoading(false);
      setCheckoutError(orderErr.response?.data?.message || 'Failed to initiate payment.');
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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
          Flexible Pricing for Every Developer
        </h1>
        <p className="mx-auto max-w-xl text-slate-400 text-sm">
          No hidden fees. Cancel or switch plans anytime. All pricing shown in Indian Rupees (INR).
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={subscription ? subscription.plan_id === plan.id : plan.name === 'Free'}
            onSelect={handleSelectPlan}
            loadingPlanId={loading && selectedPlan ? selectedPlan.id : null}
          />
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-slate-500 text-xs uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-indigo-500" /> Secure SSL checkout</span>
        <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-indigo-500" /> Mock payment gateway</span>
        <span>• 7-Day Money-Back Guarantee</span>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-6 relative overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Secure Sandbox Payment</h3>
                <p className="text-xs text-slate-400">Payment Simulation (No real charges will apply)</p>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                <p className="text-sm text-slate-400">Your subscription to <strong>{selectedPlan.name}</strong> is now active.</p>
                <p className="text-xs text-indigo-400 animate-pulse">Redirecting to Dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {checkoutError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                    {checkoutError}
                  </div>
                )}

                {/* Plan Summary */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80 mb-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Selected Membership:</span>
                    <strong className="text-white">{selectedPlan.name}</strong>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-400">Billing Cycle:</span>
                    <span className="text-slate-200">Monthly</span>
                  </div>
                  <div className="h-[1px] bg-slate-800 my-2.5"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Amount Due:</span>
                    <strong className="text-indigo-400 font-extrabold">₹{selectedPlan.price}</strong>
                  </div>
                </div>

                {/* Card Fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors py-3.5 text-center text-sm font-semibold text-white mt-4 flex items-center justify-center gap-2"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Verifying Credentials...
                    </>
                  ) : (
                    `Pay ₹${selectedPlan.price} Simulated`
                  )}
                </button>

                <p className="text-[10px] text-slate-500 text-center mt-2 leading-relaxed">
                  This transaction is fully sandboxed. Card details are only verified locally for mockup purposes. Do not enter actual credentials.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
