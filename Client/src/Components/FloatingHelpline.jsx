import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const FloatingHelpline = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Quick helpline and navigation" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Scroll To Top Button (Appears when scrolled down) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            title={lang === 'hi' ? 'ऊपर जाएं' : 'Scroll to top'}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-stone-700 shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 hover:text-emerald-700 transition cursor-pointer"
          >
            <span className="text-base font-black">↑</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Helpline Pill / Expandable Menu */}
      {isVisible && (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Close helpline"
          title="Close helpline"
          className="absolute -top-2 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-stone-200 bg-white text-xs font-bold leading-none text-stone-500 shadow-sm hover:bg-stone-100 hover:text-stone-800 cursor-pointer"
        >
          &times;
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full right-0 mb-3 w-72 sm:w-80 bg-white rounded-3xl p-4 shadow-2xl border border-stone-200 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    {lang === 'hi' ? '24/7 किसान सहायता केंद्र' : '24/7 Kisan Support'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-lg leading-none cursor-pointer p-1"
                >
                  &times;
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                {/* Direct Toll-Free Call */}
                <a
                  href="tel:18001208722"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                    📞
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase">
                      {lang === 'hi' ? 'टोल फ्री नंबर पर कॉल करें' : 'Toll Free Call'}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition">
                      1800-120-TRAK
                    </p>
                    <p className="text-[10px] text-stone-500">
                      (1800-120-8722)
                    </p>
                  </div>
                </a>

                {/* Direct WhatsApp Assistance */}
                <a
                  href="https://wa.me/919876543210?text=Namaste%20TractorHub,%20I%20need%20assistance%20with%20tractor%20booking"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-green-50 hover:bg-green-100/80 border border-green-200 transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                    💬
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-green-800 uppercase">
                      {lang === 'hi' ? 'व्हाट्सएप चैट सहायता' : 'WhatsApp Support'}
                    </p>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-green-700 transition">
                      +91 98765 43210
                    </p>
                    <p className="text-[10px] text-stone-500">
                      {lang === 'hi' ? 'तुरंत बुकिंग और सहायता' : 'Instant booking help'}
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center shadow-xl rounded-full"
        >
          {/* Quick Click-to-Call Pill (Direct Phone Action) */}
          <a
            href="tel:18001208722"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white pl-4 pr-3 py-2.5 rounded-l-full border-r border-emerald-600/60 shadow-lg text-xs font-black transition"
            title="Call Helpline: 1800-120-TRAK"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span>📞 Helpline: 1800-120-TRAK</span>
          </a>

          {/* Toggle Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-800 to-slate-900 hover:from-emerald-900 hover:to-black text-white px-3.5 sm:px-3 py-2.5 rounded-full sm:rounded-r-full sm:rounded-l-none shadow-lg text-xs font-bold transition cursor-pointer"
            title="Open Helpline Menu"
          >
            <span className="text-base sm:text-sm">📞</span>
            <span className="sm:hidden font-extrabold">Helpline</span>
            <span className="text-[10px] opacity-75">{isOpen ? '▼' : '▲'}</span>
          </button>
        </motion.div>
      </div>
      )}
    </aside>
  );
};

export default FloatingHelpline;
