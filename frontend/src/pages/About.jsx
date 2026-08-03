import { Shield, BookOpen, Star, HelpCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:px-8">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mb-4">
          Empowering the Next Generation of Developers
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-400">
          Limitless Club was founded in 2026 to provide clean, production-ready coding tutorials, architectural blueprints, and a premium workspace for programmers globally.
        </p>
      </div>

      {/* Core Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-20 bg-slate-900/30 rounded-2xl p-8 border border-slate-800/60 glass">
        <div>
          <div className="text-3xl font-extrabold text-white mb-1">10,000+</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Active Members</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white mb-1">50+</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Video Courses</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white mb-1">120+</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Boilerplates</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white mb-1">₹4M+</div>
          <div className="text-xs text-slate-400 uppercase tracking-wider">Salary Raised</div>
        </div>
      </div>

      {/* Values grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
          <span className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400 border border-indigo-500/20">
            <Shield className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Verified Content Only</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every course, article, and codebase template is hand-built by senior staff engineers. No copy-pasting code that breaks out of the box.
            </p>
          </div>
        </div>

        <div className="glass border border-slate-800 p-6 rounded-2xl flex items-start gap-4">
          <span className="rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/20">
            <BookOpen className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Architectural Blueprint Focus</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We teach architecture, not syntax. Learn microservices messaging patterns, database replica configuration, JWT token security, and secure transaction workflows.
            </p>
          </div>
        </div>
      </div>

      {/* The Mission Statement */}
      <div className="text-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-8">
        <h2 className="text-xl font-bold text-white mb-2">Our Core Promise</h2>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl mx-auto italic">
          "We do not build typical courses. We compile production configurations, detail actual security vulnerabilities, and show how complex applications are constructed in the real world. We don't hide code errors; we debug them together."
        </p>
      </div>
    </div>
  );
};

export default About;
