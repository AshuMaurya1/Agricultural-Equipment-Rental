import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Banner = () => {
  const navigate = useNavigate()
  const { user, isOwner, setShowLogin } = useAppContext()

  const handleListTractor = () => {
    if (!user) return setShowLogin(true)
    navigate(isOwner ? '/owner/add-tractor' : '/owner')
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto grid w-[calc(100%-2rem)] max-w-7xl grid-cols-1 overflow-hidden rounded-2xl bg-linear-to-br from-[#0558FE] via-[#3175FF] to-[#A9CFFF] shadow-lg sm:w-[calc(100%-3rem)] sm:rounded-3xl lg:w-[calc(100%-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] xl:grid-cols-[minmax(0,1fr)_minmax(390px,0.9fr)]"
    >
      <div className="min-w-0 px-5 py-7 text-white sm:px-8 sm:py-9 md:self-center md:px-10 lg:px-12 lg:py-12 xl:px-16">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 sm:text-xs sm:tracking-[0.18em]">Earn with TractorHub</p>
        <h2 className="max-w-xl text-[clamp(1.45rem,6vw,2.5rem)] font-semibold leading-tight">Do You Own a Powerful Tractor?</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
          Monetize your tractor effortlessly. We handle verification, insurance support, and secure payments.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleListTractor}
          className="mt-5 min-h-11 w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-slate-100 sm:w-auto cursor-pointer"
        >
          List Your Tractor
        </motion.button>
      </div>

      <div className="flex w-full items-end justify-center px-5 pb-5 sm:px-8 sm:pb-8 lg:min-h-full lg:px-6 lg:pb-0">
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          src={assets.Banner1}
          alt="Agricultural equipment rental"
          className="aspect-[16/7] w-full max-w-2xl rounded-xl object-cover object-center shadow-2xl lg:h-full lg:min-h-56 lg:max-w-none lg:rounded-b-none lg:rounded-tl-2xl"
        />
      </div>
    </motion.section>
  )
}

export default Banner
