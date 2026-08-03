import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Compass, Play, FileText, Lock, Unlock, ArrowRight,
  TrendingUp, Award, Clock, FileCode, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, subscription } = useAuth();
  const [contents, setContents] = useState([]);
  const [activePlan, setActivePlan] = useState('Free');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, video, article, pdf
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedLockedItem, setSelectedLockedItem] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await API.get('/membership/content');
        setContents(res.data.contents);
        setActivePlan(res.data.activePlan);
      } catch (err) {
        console.error('Error fetching dashboard content:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const filteredContents = contents.filter(item => {
    if (activeTab === 'all') return true;
    return item.content_type.toLowerCase() === activeTab.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const getPlanBadgeColor = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'premium':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'pro':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8">
      {/* Welcome Banner */}
      <section className="glass rounded-3xl p-6 md:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-[60px] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Dashboard Overview</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 text-sm mt-1">Explore your premium lessons, boilerplates, and downloads.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4">
            <div>
              <span className="text-xs text-slate-500 block">Current Membership</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPlanBadgeColor(activePlan)} mt-1`}>
                {activePlan} Tier
              </span>
            </div>
            {activePlan !== 'Premium' && (
              <Link
                to="/pricing"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 text-xs font-semibold text-white flex items-center gap-1"
              >
                Upgrade Plan <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-medium">Courses Active</span>
            <span className="text-xl font-bold text-white mt-0.5">
              {contents.filter(i => !i.isLocked).length} Unlocked
            </span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-medium">My Progress</span>
            <span className="text-xl font-bold text-white mt-0.5">84% Completion</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-slate-800/60 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-medium">Time Studied</span>
            <span className="text-xl font-bold text-white mt-0.5">14.5 Hours</span>
          </div>
        </div>
      </section>

      {/* Protected Content Catalog */}
      <section className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Your Membership Library</h2>
            <p className="text-xs text-slate-400">Locked assets require a higher membership plan tier.</p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('article')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'article' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'pdf' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resources/PDF
            </button>
          </div>
        </div>

        {/* Contents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredContents.map(item => (
            <div
              key={item.id}
              className={`glass rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                item.isLocked
                  ? 'border-slate-900/60 bg-slate-950/20'
                  : 'border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${
                    item.membership_level === 'Premium'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : item.membership_level === 'Pro'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.membership_level} Plan
                  </span>
                  
                  {item.isLocked ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 border border-slate-900 text-slate-500 shadow-md">
                      <Lock className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Unlock className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">{item.description}</p>
              </div>

              {/* Action */}
              <div className="border-t border-slate-900 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  {item.content_type === 'video' ? (
                    <><Play className="h-3 w-3 text-indigo-400 fill-indigo-400" /> Lesson Video</>
                  ) : item.content_type === 'pdf' ? (
                    <><FileCode className="h-3 w-3 text-emerald-400" /> Code Template</>
                  ) : (
                    <><FileText className="h-3 w-3 text-amber-400" /> Documentation</>
                  )}
                </span>

                {item.isLocked ? (
                  <button
                    onClick={() => setSelectedLockedItem(item)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Unlock content <ArrowRight className="h-3 w-3" />
                  </button>
                ) : item.content_type === 'video' ? (
                  <button
                    onClick={() => setSelectedVideo(item)}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-4 py-2 text-xs font-semibold text-white flex items-center gap-1 transition-all"
                  >
                    Watch Lesson <Play className="h-3 w-3 fill-white ml-0.5" />
                  </button>
                ) : item.content_type === 'pdf' ? (
                  <a
                    href={item.content_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white flex items-center gap-1 transition-all shadow-md shadow-indigo-500/10"
                  >
                    Download Resource
                  </a>
                ) : (
                  <button
                    onClick={() => alert(`Showing documentation: ${item.description}`)}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-xs font-semibold text-white flex items-center gap-1 transition-all"
                  >
                    Read Article
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-4 border-b border-slate-900 bg-slate-950">
              <h3 className="text-sm font-bold text-white">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-slate-400 hover:text-white"
              >
                close
              </button>
            </div>
            
            {/* Embedded Player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                title={selectedVideo.title}
                src={selectedVideo.content_url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div className="p-5 bg-slate-950/60">
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                Unlocked under {selectedVideo.membership_level} Plan
              </span>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Locked Content Prompt Modal */}
      {selectedLockedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-950 border border-slate-800 p-6 shadow-2xl relative text-center space-y-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Lock className="h-5 w-5" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white">Upgrade Plan to Unlock</h3>
              <p className="text-xs text-slate-400 mt-2">
                The resource <strong>"{selectedLockedItem.title}"</strong> is protected and requires a <strong>{selectedLockedItem.membership_level}</strong> plan or higher.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-left space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Plan features include:</span>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Full access to all protected tutorials
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Download zip archives and project source codes
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Priority access in developer forum
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setSelectedLockedItem(null)}
                className="rounded-xl border border-slate-800 bg-slate-900 py-3 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Maybe Later
              </button>
              <Link
                to="/pricing"
                onClick={() => setSelectedLockedItem(null)}
                className="rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/15"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
