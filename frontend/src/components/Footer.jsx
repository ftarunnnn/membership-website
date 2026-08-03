import { Link } from 'react-router-dom';
import { Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/40 py-12 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Limitless
              </span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-xs text-indigo-400 border border-indigo-500/30">CLUB</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              Empowering developers, creators, and professionals with premium resources, tutorials, and masterclasses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 transition-colors hover:text-indigo-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-slate-500 transition-colors hover:text-indigo-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href="#" className="text-slate-500 transition-colors hover:text-indigo-400">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Links: Platform */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">Platform</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-slate-400 transition-colors hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-slate-400 transition-colors hover:text-white">Membership Plans</Link></li>
              <li><Link to="/about" className="text-sm text-slate-400 transition-colors hover:text-white">Success Stories</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">Company</h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-slate-400 transition-colors hover:text-white">About Us</Link></li>
              <li><a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-400 transition-colors hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">Stay Updated</h3>
            <p className="mb-3 text-sm text-slate-400">Subscribe to our newsletter for exclusive weekly content.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 hover:bg-indigo-500 transition-colors"
              >
                <Mail className="h-4 w-4 text-white" />
              </button>
            </form>
          </div>
          
        </div>

        <div className="mt-12 border-t border-slate-900 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Limitless Club. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Antigravity AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
