import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Menu, X, User, LogOut, Shield, Compass, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-800 px-4 py-3 sm:px-6 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Limitless
          </span>
          <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-xs text-indigo-400 border border-indigo-500/30">CLUB</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm text-slate-300 transition-colors hover:text-white">Home</Link>
          <Link to="/about" className="text-sm text-slate-300 transition-colors hover:text-white">About</Link>
          <Link to="/pricing" className="text-sm text-slate-300 transition-colors hover:text-white">Pricing</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white">
                <Compass className="h-4 w-4" /> Dashboard
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-sm text-amber-400 transition-colors hover:text-amber-300">
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              )}

              <div className="h-4 w-[1px] bg-slate-800"></div>

              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-200 hover:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Sign In</Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/35"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-3 space-y-3 pb-3 md:hidden">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            About
          </Link>
          <Link
            to="/pricing"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-base text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            Pricing
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <Compass className="h-5 w-5" /> Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-base text-amber-400 hover:bg-slate-900 hover:text-amber-300"
                >
                  <Shield className="h-5 w-5" /> Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-base text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                <User className="h-5 w-5" /> Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-base text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" /> Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 border-t border-slate-900 pt-3 px-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-lg border border-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
