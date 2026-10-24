import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

const Banner = () => {
  const navigate = useNavigate()
  const { user, isOwner, setShowLogin } = useAppContext()
  const { lang } = useLanguage()

  const handleListTractor = () => {
    if (!user) return setShowLogin(true)
    navigate(isOwner ? '/owner/add-tractor' : '/owner')
  }

  return (
    <section className="py-10 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 shadow-2xl border border-emerald-700/50 grid grid-cols-1 lg:grid-cols-12 items-stretch"
      >
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Left Column: Text & Value Proposition (Desktop: 7 of 12 columns) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 xl:p-14 text-white z-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3.5">
              <span>🌾</span>
              <span>{lang === 'hi' ? 'ट्रैक्टर मालिक कमाई मंच' : 'Partner with TractorHub'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white tracking-tight">
              {lang === 'hi'
                ? 'क्या आपके पास आधुनिक ट्रैक्टर या कृषि उपकरण हैं?'
                : 'Do You Own High-Power Farm Machinery?'}
            </h2>

            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-emerald-100/90 max-w-xl">
              {lang === 'hi'
                ? 'अपने खाली पड़े ट्रैक्टर को किराए पर दें और अतिरिक्त कमाई करें। सत्यापित बुकिंग, अग्रिम भुगतान व पूर्ण सुरक्षा प्रबंधन।'
                : 'Monetize idle farm equipment between harvest cycles. We handle local farmer verification, secure advance deposits, and dispatch scheduling across your district.'}
            </p>

            {/* Quick Trust Pillars (Desktop responsive stats grid) */}
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 py-4 border-y border-emerald-800/60 max-w-lg">
              <div>
                <p className="text-base sm:text-xl font-extrabold text-amber-400">₹45k+</p>
                <p className="text-[10px] sm:text-xs text-emerald-200/80 mt-0.5">
                  {lang === 'hi' ? 'मासिक औसत कमाई' : 'Avg. Monthly Earnings'}
                </p>
              </div>
              <div className="border-l border-emerald-800/60 pl-2 sm:pl-4">
                <p className="text-base sm:text-xl font-extrabold text-white">100%</p>
                <p className="text-[10px] sm:text-xs text-emerald-200/80 mt-0.5">
                  {lang === 'hi' ? 'सत्यापित किसान' : 'Verified Local Farmers'}
                </p>
              </div>
              <div className="border-l border-emerald-800/60 pl-2 sm:pl-4">
                <p className="text-base sm:text-xl font-extrabold text-amber-400">₹0</p>
                <p className="text-[10px] sm:text-xs text-emerald-200/80 mt-0.5">
                  {lang === 'hi' ? 'शून्य लिस्टिंग शुल्क' : 'Zero Listing Fee'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button & Trust Note */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleListTractor}
              className="min-h-12 px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold transition-all shadow-lg shadow-amber-400/20 cursor-pointer flex items-center gap-2"
            >
              <span>{lang === 'hi' ? 'अपना ट्रैक्टर लिस्ट करें 🚜' : 'List Your Tractor Fleet 🚜'}</span>
            </motion.button>
            <span className="text-xs text-emerald-200/80 font-medium">
              ⚡ Instant owner onboarding · Direct bank settlements
            </span>
          </div>
        </div>

        {/* Right Column: Visual Showcase (Desktop: 5 of 12 columns, fully aligned and edge-balanced) */}
        <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 flex items-center justify-center w-full">
          <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-emerald-700/50 group bg-emerald-950">
            <motion.img
              initial={{ scale: 1.05, opacity: 0.9 }}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5 }}
              src={assets.Banner_card || assets.download7}
              alt="Agricultural equipment fleet banner"
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle contrast gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/20 to-transparent pointer-events-none" />

            {/* Floating Trust Badge 1: Top Left */}
            <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-stone-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-900">500+ Active Machines</span>
            </div>

            {/* Floating Trust Badge 2: Bottom Overlay */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-500/30 flex items-center justify-between text-white">
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  {lang === 'hi' ? 'सुरक्षित उपकरण होस्टिंग' : 'Secure Equipment Hosting'}
                </p>
                <p className="text-xs sm:text-sm font-extrabold text-white">
                  {lang === 'hi' ? 'गारंटीड अग्रिम भुगतान' : 'Guaranteed Advance Deposit'}
                </p>
              </div>
              <span className="text-xl">🛡️</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Banner
