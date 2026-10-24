import { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { toast } from 'react-hot-toast'
import { motion } from 'motion/react'

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const menuLinks = [
    { name: t('home'), path: '/' },
    { name: t('tractors'), path: '/tractor' },
    { name: t('myBookings'), path: '/mybooking' }
  ];

  const handleNavSearch = (e) => {
    if (e.key === 'Enter') {
      if (navSearch.trim()) {
        navigate(`/tractor?query=${encodeURIComponent(navSearch.trim())}`);
      } else {
        navigate('/tractor');
      }
    }
  };

  const handleSearchClick = () => {
    if (navSearch.trim()) {
      navigate(`/tractor?query=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate('/tractor');
    }
  };

  const changeRole = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true)
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Unable to change role');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 glass-nav border-b border-stone-200/80 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0"
            >
              <span className="text-lg sm:text-xl">🚜</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition leading-tight">
                Tractor<span className="text-emerald-600">Hub</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-700 tracking-wider uppercase">
                Kisan Rental Network
              </span>
            </div>
          </Link>

          {/* Kisan Helpline Badge (Large Screens) */}
          <div className="hidden xl:flex items-center gap-1.5 pl-4 border-l border-stone-200 text-xs text-stone-600">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-emerald-800">Helpline:</span>
            <a href="tel:18001208722" className="hover:text-emerald-700 hover:underline font-medium">1800-120-TRAK</a>
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {/* Main Links */}
          <nav className="flex items-center gap-1">
            {menuLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 font-bold'
                      : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {user && (
              <Link
                to="/security-sessions"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  location.pathname === '/security-sessions'
                    ? 'text-emerald-800 bg-emerald-50 font-bold'
                    : 'text-stone-700 hover:text-emerald-700 hover:bg-stone-100/70'
                }`}
              >
                Security
              </Link>
            )}
          </nav>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center text-xs gap-1.5 border border-stone-200 bg-stone-50/80 px-3 py-1.5 rounded-full w-44 xl:w-52 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition">
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={handleNavSearch}
              className="w-full bg-transparent outline-none placeholder-stone-400 text-xs text-stone-800"
              placeholder={t('searchPlaceholder')}
            />
            <button
              onClick={handleSearchClick}
              aria-label="Search"
              className="text-stone-400 hover:text-emerald-600 cursor-pointer"
            >
              <img src={assets.search} alt="search" className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
            </button>
          </div>

          {/* Language Switcher Segmented Pill */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200/80 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => { if (lang !== 'en') toggleLanguage(); }}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => { if (lang !== 'hi') toggleLanguage(); }}
              className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                lang === 'hi'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🇮🇳</span>
              <span>हिन्दी</span>
            </button>
          </div>

          {/* Role / List Machine Button */}
          <button
            onClick={() => {
              if (isOwner) navigate('/owner');
              else changeRole();
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 text-stone-700 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition cursor-pointer"
          >
            {isOwner ? `⚙️ ${t('dashboard')}` : `🚜 ${t('listTractor')}`}
          </button>

          {/* Login / Logout Button */}
          <button
            onClick={() => {
              if (user) logout();
              else setShowLogin(true);
            }}
            className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow-md cursor-pointer"
          >
            {user ? t('logout') : t('login')}
          </button>
        </div>

        {/* Mobile Right Controls: Language pill + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick Mobile Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full text-xs font-bold border border-stone-200 bg-stone-50 text-stone-700"
          >
            {lang === 'en' ? '🇮🇳 हिं' : 'EN'}
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition cursor-pointer"
            aria-label="Toggle Menu"
            onClick={() => setOpen(!open)}
          >
            <img src={open ? assets.menuCloser : assets.menu} alt="menu" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Visible on < md) */}
      <div
        className={`md:hidden fixed inset-x-0 top-[57px] sm:top-[61px] h-[calc(100vh-57px)] sm:h-[calc(100vh-61px)] bg-white/98 backdrop-blur-xl border-t border-stone-200 flex flex-col justify-between p-5 overflow-y-auto transition-all duration-300 z-50 ${
          open ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-4">
          {/* Mobile Search Input */}
          <div className="flex items-center text-sm gap-2 border border-stone-200 bg-stone-50 px-3.5 py-2 rounded-2xl w-full">
            <img src={assets.search} alt="search" className="w-4 h-4 opacity-60" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setOpen(false);
                  handleNavSearch(e);
                }
              }}
              className="w-full bg-transparent outline-none placeholder-stone-400 text-xs text-stone-800"
              placeholder={t('searchPlaceholder')}
            />
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1 pt-2">
            {menuLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-sm font-bold transition flex items-center justify-between ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-stone-400">→</span>
                </Link>
              );
            })}
            {user && (
              <Link
                to="/security-sessions"
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-2xl text-sm font-bold transition flex items-center justify-between ${
                  location.pathname === '/security-sessions'
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>Security & Sessions</span>
                <span className="text-stone-400">→</span>
              </Link>
            )}
          </nav>

          {/* Mobile Helpline Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
              📞 24/7 Kisan Helpline
            </span>
            <a href="tel:18001208722" className="text-sm font-black text-emerald-900 underline block">
              1800-120-TRAK (Toll-Free)
            </a>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              Immediate tractor assistance, operator booking, or breakdown support
            </span>
          </div>
        </div>

        {/* Mobile Bottom Action Buttons */}
        <div className="pt-4 border-t border-stone-200 flex flex-col gap-2.5 pb-6">
          <button
            onClick={() => {
              setOpen(false);
              if (isOwner) navigate('/owner');
              else changeRole();
            }}
            className="w-full py-3 rounded-2xl text-xs font-bold border border-stone-300 text-stone-800 hover:bg-stone-50 text-center"
          >
            {isOwner ? `⚙️ ${t('dashboard')}` : `🚜 ${t('listTractor')}`}
          </button>

          <button
            onClick={() => {
              setOpen(false);
              if (user) logout();
              else setShowLogin(true);
            }}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-extrabold text-center shadow-md shadow-emerald-700/20"
          >
            {user ? t('logout') : t('login')}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
