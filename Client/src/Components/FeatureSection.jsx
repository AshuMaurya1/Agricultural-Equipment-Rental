import Title from './Title'
import TractorCard from './TractorCard'
import { dummyTractorData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { motion } from 'motion/react'

const FeatureSection = () => {
  const navigate = useNavigate()
  const { tractors } = useAppContext()
  const { lang } = useLanguage()
  const displayList = tractors && tractors.length > 0 ? tractors.slice(0, 6) : dummyTractorData.slice(0, 6)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {lang === 'hi' ? 'उच्च मांग वाले मॉडल' : 'High Demand Fleet'}
        </span>
        <div className="mt-3">
          <Title
            title={lang === 'hi' ? 'प्रमुख आधुनिक ट्रैक्टर' : 'Featured Agricultural Equipment'}
            subtitle={
              lang === 'hi'
                ? 'जुताई, बुवाई व कटाई के लिए उच्च क्षमता वाले विश्वसनीय ट्रैक्टर तुरंत उपलब्ध।'
                : 'Explore high-performance tractors with optional implements and certified operators ready for your next harvest.'
            }
          />
        </div>
      </motion.div>

      {/* Grid of Tractor Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 w-full"
      >
        {displayList.map((tractor) => (
          <motion.div
            key={tractor._id || tractor.id}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <TractorCard tractor={tractor} />
          </motion.div>
        ))}
      </motion.div>

      {/* Explore All CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        viewport={{ once: true }}
        className="flex justify-center mt-12"
      >
        <button
          onClick={() => {
            navigate('/tractor')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-stone-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 text-slate-800 font-bold rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition text-sm group"
        >
          <span>{lang === 'hi' ? 'सभी ट्रैक्टर ब्राउज़ करें' : 'Explore All Tractors & Implements'}</span>
          <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </motion.div>
    </section>
  )
}

export default FeatureSection
