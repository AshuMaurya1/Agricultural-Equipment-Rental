import { assets } from '../assets/assets'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Banner = () => {
  const navigate = useNavigate()
  const { user, isOwner, setShowLogin } = useAppContext()

  const handleListTractor = () => {
    if (!user) {
      setShowLogin(true)
      return
    }
    navigate(isOwner ? '/owner/add-tractor' : '/owner')
  }

  return (
    <motion.div
    initial={{opacity: 0, y: 50}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration : 0.6}}
    className='w-5xl flex flex-col md:flex-row md:items-start items-center justify-between px-8 py-10 md:pl-14 bg-linear-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>
        <div className='text-white'>
            <h2 className='text-3xl font-medium'>Do You Own a Powerful Tractor?</h2>
            <p className='mt-2'>Monetize your tractor effortlessly by listing it on TractorHub.</p>
            <p className='max-w-130'>We handle equipment verification, insurance support, and secure payments — so you earn passive income, stress-free.</p>

            <motion.button
            whileHover={{scale : 1.05}}
            onClick={handleListTractor}
            className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer font-medium'>
                List Your Tractor
            </motion.button>
        </div>
            <motion.img 
            initial={{opacity:0, x: 50}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.4}}
            src={assets.Banner1} alt="Tractor" className='max-h-45 mt-3 rounded-2xl' />
    </motion.div>
  )
}

export default Banner
