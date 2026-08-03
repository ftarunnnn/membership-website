import { Check, Loader2 } from 'lucide-react';

const PricingCard = ({ plan, isCurrentPlan, onSelect, loadingPlanId }) => {
  const isPopular = plan.name === 'Pro';
  const isPremium = plan.name === 'Premium';

  return (
    <div
      className={`glass-hover glass flex flex-col rounded-2xl p-6 relative ${
        isPopular ? 'border-indigo-500 bg-slate-900/60 ring-2 ring-indigo-500/20' : 'border-slate-800'
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
          Popular
        </span>
      )}
      {isPremium && (
        <span className="absolute -top-3 right-6 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
          Best Value
        </span>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
        <p className="text-sm text-slate-400 min-h-[40px]">
          {plan.name === 'Free'
            ? 'Access core materials and start your coding journey.'
            : plan.name === 'Pro'
            ? 'Level up your development with full access to standard videos & code.'
            : 'Become a master developer with advanced content and 1-on-1 access.'}
        </p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-white">₹{plan.price}</span>
          <span className="text-sm text-slate-400">/{plan.billing_period === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
      </div>

      {/* Features List */}
      <ul className="mb-8 space-y-3.5 flex-1">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className="rounded bg-indigo-500/10 p-0.5 mt-0.5">
              <Check className="h-3.5 w-3.5 text-indigo-400" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      {isCurrentPlan ? (
        <button
          disabled
          className="w-full rounded-xl bg-slate-900 border border-slate-800 py-3 text-center text-sm font-semibold text-slate-400 cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : (
        <button
          onClick={() => onSelect(plan)}
          disabled={loadingPlanId !== null}
          className={`w-full rounded-xl py-3 text-center text-sm font-semibold shadow-lg transition-all flex items-center justify-center gap-2 ${
            isPopular
              ? 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/30 text-white'
              : isPremium
              ? 'bg-purple-600 hover:bg-purple-500 hover:shadow-purple-500/30 text-white'
              : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white'
          }`}
        >
          {loadingPlanId === plan.id ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </>
          ) : plan.price === 0 ? (
            'Get Started'
          ) : (
            'Upgrade Now'
          )}
        </button>
      )}
    </div>
  );
};

export default PricingCard;
