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
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mx-auto grid w-[calc(100%-2rem)] max-w-7xl grid-cols-1 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 shadow-xl sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.9fr)] border border-emerald-800/50"
    >
      <div className="min-w-0 px-6 py-8 text-white sm:px-10 sm:py-12 md:self-center lg:px-14 lg:py-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <span>🌾</span>
          <span>{lang === 'hi' ? 'ट्रैक्टर मालिक कमाई मंच' : 'Partner with TractorHub'}</span>
        </div>

        <h2 className="max-w-xl text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white">
          {lang === 'hi'
            ? 'क्या आपके पास आधुनिक ट्रैक्टर या कृषि उपकरण हैं?'
            : 'Do You Own High-Power Farm Machinery?'}
        </h2>

        <p className="mt-3.5 max-w-xl text-sm sm:text-base leading-relaxed text-emerald-100/90">
          {lang === 'hi'
            ? 'अपने खाली पड़े ट्रैक्टर को किराए पर दें और अतिरिक्त कमाई करें। सत्यापित बुकिंग, अग्रिम भुगतान व पूर्ण सुरक्षा प्रबंधन।'
            : 'Monetize idle farm equipment between harvest cycles. We handle local farmer verification, secure advance deposits, and scheduling.'}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleListTractor}
            className="min-h-12 px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold transition-all shadow-lg shadow-amber-400/20 cursor-pointer"
          >
            {lang === 'hi' ? 'अपना ट्रैक्टर लिस्ट करें 🚜' : 'List Your Tractor Fleet 🚜'}
          </motion.button>
          <span className="text-xs text-emerald-200/80 font-medium">
            Zero listing fees · Verified local farmers
          </span>
        </div>
      </div>

      <div className="flex w-full items-end justify-center px-6 pb-6 sm:px-10 sm:pb-10 lg:min-h-full lg:px-6 lg:pb-0">
        <motion.img
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          src={assets.Banner1}
          alt="Agricultural equipment fleet"
          className="aspect-[16/8] w-full max-w-2xl rounded-2xl object-cover object-center shadow-2xl lg:h-full lg:min-h-64 lg:max-w-none lg:rounded-b-none lg:rounded-tl-3xl border border-emerald-700/40"
        />
      </div>
    </motion.section>
  )
}

export default Banner
