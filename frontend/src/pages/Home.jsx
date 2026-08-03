import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Play, Code, Users, Cpu, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Home = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the membership system work?',
      a: 'We offer three levels of memberships: Free, Pro, and Premium. Signing up automatically places you on the Free tier. You can upgrade to Pro or Premium at any time via credit card simulation to instantly unlock premium video courses, downloads, and forums.'
    },
    {
      q: 'Can I cancel or change my plan anytime?',
      a: 'Absolutely! You can upgrade, downgrade, or cancel your membership directly from your profile settings page. If you cancel a premium plan, you are immediately set back to the Free plan.'
    },
    {
      q: 'Is my credit card details processed securely?',
      a: 'Yes, this platform uses a fully functional checkout flow simulation, meaning no real money is processed and you can test card payments safely using sandbox/test credentials.'
    },
    {
      q: 'What kind of content is in the Premium plan?',
      a: 'The Premium plan unlocks our advanced architectural course catalog including microservices masterclasses, access to our community Discord server, weekly 1-on-1 Q&A sessions, and certified completion diplomas.'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
      {/* Hero Section */}
      <section className="relative py-20 text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]"></div>
        <div className="absolute top-1/3 left-1/3 -z-10 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]"></div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-6">
          <Cpu className="h-3 w-3" /> Introducing Limitless Club 2.0
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1] mb-6">
          Unlock Unlimited Tech Knowledge with Our{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Membership Portal
          </span>
        </h1>
        
        <p className="mx-auto max-w-2xl text-base text-slate-400 sm:text-lg mb-10">
          Learn high-income development skills, download boilerplates, and connect with elite engineers. Start today on our free tier.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/register'}
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:shadow-indigo-500/35 transition-all flex items-center gap-2"
          >
            {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/pricing"
            className="rounded-xl bg-slate-900 border border-slate-800 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
          >
            Explore Plans
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Designed for Growth</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Get access to premium features engineered to accelerate your software engineering career.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass rounded-2xl p-6 border border-slate-800">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-5 text-indigo-400">
              <Play className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Exclusive Video Guides</h3>
            <p className="text-sm text-slate-400">Watch high-production, step-by-step developer tutorials explaining microservices, REST APIs, and authentication.</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-800">
            <div className="h-10 w-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-5 text-purple-400">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Boilerplate Downloads</h3>
            <p className="text-sm text-slate-400">Save hours of setup. Grab ready-made React + Express boilerplates, deployment configurations, and utility templates.</p>
          </div>

          <div className="glass rounded-2xl p-6 border border-slate-800">
            <div className="h-10 w-10 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center justify-center mb-5 text-pink-400">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Member Community</h3>
            <p className="text-sm text-slate-400">Interact with other developers, showcase projects, and get feedback on design systems or scaling dilemmas.</p>
          </div>

        </div>
      </section>

      {/* Mini CTA/Tier Highlights */}
      <section className="glass rounded-3xl p-8 md:p-12 border border-slate-800/80 my-12 bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Choose Your Level of Access</h2>
            <p className="text-slate-400 mb-6 text-sm md:text-base leading-relaxed">
              We offer simple, flexible tiers. Upgrade or downgrade as your project needs change. All paid plans include a 7-day money-back guarantee.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Free tier gets you basic text tutorials instantly
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Pro tier adds premium Express & React video templates
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-indigo-400" /> Premium adds masterclasses and 1-on-1 Slack channel
              </div>
            </div>
            <div className="mt-8">
              <Link
                to="/pricing"
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-all inline-flex items-center gap-1.5"
              >
                Compare Plans <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center p-6 text-center">
              <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 p-3 mb-3 text-indigo-400 animate-pulse">
                <Play className="h-6 w-6 fill-indigo-400" />
              </span>
              <span className="text-sm font-bold text-white mb-1">Preview Masterclass Video</span>
              <span className="text-xs text-slate-400">Lock indicators display for non-premium members.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 border-t border-slate-900 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Everything you need to know about plans, billing, and access.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass rounded-xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-white font-medium hover:bg-slate-900/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-400 border-t border-slate-900 bg-slate-950/20 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
