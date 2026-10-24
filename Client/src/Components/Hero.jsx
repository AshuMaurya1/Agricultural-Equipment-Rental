import { useState, useMemo } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { getDistricts, getBlocks } from '../data/indiaLocations'

const Hero = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedBlock, setSelectedBlock] = useState('')
  const [rentalType, setRentalType] = useState('day') // 'day' | 'hour' | 'acre'
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext()
  const { t, lang } = useLanguage()

  const allDistricts = useMemo(() => getDistricts('Uttar Pradesh'), [])
  const availableBlocks = useMemo(() => {
    if (!selectedDistrict) return []
    return getBlocks('Uttar Pradesh', selectedDistrict)
  }, [selectedDistrict])

  const handleSearch = (e) => {
    e.preventDefault()
    const searchParams = new URLSearchParams()
    const finalLocation = selectedBlock ? `${selectedBlock}, ${selectedDistrict}` : selectedDistrict
    if (finalLocation) searchParams.set('pickupLocation', finalLocation)
    if (pickupDate) searchParams.set('pickupDate', pickupDate)
    if (returnDate) searchParams.set('returnDate', returnDate)
    if (rentalType) searchParams.set('unit', rentalType)
    navigate(`/tractor?${searchParams.toString()}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-stone-50 to-white pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200/70">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Prop, Tagline & Search */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200/90 text-emerald-800 text-[11px] sm:text-xs font-semibold mb-3 sm:mb-4 shadow-2xs max-w-full"
            >
              <span className="text-sm sm:text-base shrink-0">🌾</span>
              <span className="truncate">
                {lang === 'hi' ? 'उत्तर प्रदेश का अग्रणी कृषि उपकरण रेंटल नेटवर्क' : "North India's Trusted Agri Equipment Network"}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-extrabold text-slate-900 tracking-tight leading-[1.2]"
            >
              {lang === 'hi' ? (
                <>
                  भारी कृषि उपकरण व ट्रैक्टर <br className="hidden sm:inline" />
                  <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                    दिन, घंटे या एकड़
                  </span> अनुसार किराए पर
                </>
              ) : (
                <>
                  Heavy Machinery, Flexible Rentals — <br className="hidden sm:inline" />
                  <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy decoration-2">
                    By Day, Hour, or Acre
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-stone-600 max-w-xl leading-relaxed"
            >
              {lang === 'hi'
                ? 'महिंद्रा, स्वराज, मैसी जैसे भरोसेमंद ट्रैक्टर, आधुनिक रोटावेटर और कुशल ऑपरेटर सीधे आपके खेत तक उपलब्ध।'
                : 'Rent verified 35-65+ HP tractors with implements (Rotavators, MB Ploughs) and certified drivers directly to your farmland.'}
            </motion.p>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-stone-700 font-medium"
            >
              <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-emerald-600 font-bold">✓</span> 500+ Verified Tractors
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-emerald-600 font-bold">✓</span> Certified Local Operators
              </div>
              <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-emerald-600 font-bold">✓</span> Transparent Delivery (₹40/km)
              </div>
            </motion.div>

            {/* Quick Action Link Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 sm:mt-6 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-semibold"
            >
              <span className="text-stone-400 text-[11px]">Popular:</span>
              <Link to="/tractor?query=Mahindra" className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 transition text-stone-600">
                Mahindra 575 DI
              </Link>
              <Link to="/tractor?query=Swaraj" className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 transition text-stone-600">
                Swaraj 744 FE
              </Link>
              <Link to="/tractor?query=Rotavator" className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 transition text-stone-600">
                With Rotavator
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Visual Showcase with Floating Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative w-full"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Outer decorative gradient glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />

              {/* Main Machine Card */}
              <div className="relative bg-white rounded-3xl p-2.5 sm:p-3 border border-stone-200 shadow-xl overflow-hidden group">
                <div className="relative h-60 sm:h-72 md:h-80 lg:h-88 xl:h-96 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={assets.Ace || assets.download1}
                    alt="ACE Heavy Duty Tractor"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 flex items-end justify-between text-white">
                    <div>
                      <span className="text-[10px] sm:text-xs font-semibold text-emerald-300 uppercase tracking-wider block">Top Rated Machine</span>
                      <h4 className="text-base sm:text-lg font-bold leading-tight">ACE 60 HP 4WD Turbo</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-black text-amber-400">₹1,500<span className="text-xs text-white/80 font-normal">/day</span></div>
                      <div className="text-[10px] sm:text-[11px] text-stone-300">or ₹600/hour</div>
                    </div>
                  </div>
                </div>

                {/* Floating Micro-Badge 1: HP & Engine */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2"
                >
                  <span className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-bold">
                    ⚡
                  </span>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">60 HP Di Engine</div>
                    <div className="text-[10px] text-stone-500">Dual Clutch · 4WD</div>
                  </div>
                </motion.div>

                {/* Floating Micro-Badge 2: Location & Availability (Safe inside right margin) */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 right-3 sm:right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Available Today</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Sonbhadra & Gorakhpur</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dedicated Modern Agri-Search Booking Widget */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 sm:mt-12 bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-stone-200/90 max-w-5xl mx-auto"
        >
          {/* Rental Unit Selection Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {lang === 'hi' ? 'किराया प्रकार:' : 'Rental Mode:'}
              </span>
              <div className="flex items-center bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRentalType('day')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rentalType === 'day'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  📅 {lang === 'hi' ? 'प्रति दिन' : 'Full Day'}
                </button>
                <button
                  type="button"
                  onClick={() => setRentalType('hour')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rentalType === 'hour'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  ⏱️ {lang === 'hi' ? 'प्रति घंटा' : 'Hourly'}
                </button>
                <button
                  type="button"
                  onClick={() => setRentalType('acre')}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rentalType === 'acre'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🌾 {lang === 'hi' ? 'प्रति एकड़' : 'Per Acre'}
                </button>
              </div>
            </div>

            <span className="text-xs text-stone-500 hidden sm:inline">
              ⚡ Instant dispatch with optional trained operator
            </span>
          </div>

          {/* Search Inputs Form (Responsive Grid) */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
            
            {/* Field 1: District & Optional Block Location */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col justify-center p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition">
              <div className="flex items-center justify-between">
                <label htmlFor="hero-district" className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <span>📍</span> {t('pickupLocation')}
                </label>
                {selectedBlock && (
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.2 rounded-full border border-emerald-200 truncate max-w-[110px]">
                    {selectedBlock}
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-1.5 items-center">
                <select
                  id="hero-district"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value)
                    setSelectedBlock('')
                  }}
                  className="bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer w-full truncate"
                  required
                >
                  <option value="">{t('pickupLocationPlaceholder')}</option>
                  {allDistricts.map((district) => (
                    <option value={district} key={district}>
                      {district} (UP)
                    </option>
                  ))}
                </select>

                {availableBlocks.length > 0 && (
                  <select
                    id="hero-block"
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(e.target.value)}
                    className="bg-white border border-stone-200 text-xs font-semibold text-emerald-900 outline-none cursor-pointer rounded-lg px-2 py-1 max-w-[125px] shrink-0 shadow-2xs"
                    title="Choose specific Block / Tehsil (Optional)"
                  >
                    <option value="">All Blocks</option>
                    {availableBlocks.map((blk) => (
                      <option key={blk} value={blk}>
                        {blk}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Field 2: Pickup Date */}
            <div className="sm:col-span-1 lg:col-span-3 flex flex-col justify-center p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition">
              <label htmlFor="hero-pickup-date" className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <span>📅</span> {t('pickupDate')}
              </label>
              <input
                id="hero-pickup-date"
                type="date"
                value={pickupDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setPickupDate(e.target.value)}
                className="mt-1 bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer w-full"
                required
              />
            </div>

            {/* Field 3: Return Date */}
            <div className="sm:col-span-1 lg:col-span-3 flex flex-col justify-center p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-500 transition">
              <label htmlFor="hero-return-date" className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <span>↩️</span> {t('returnDate')}
              </label>
              <input
                id="hero-return-date"
                type="date"
                value={returnDate}
                min={pickupDate || new Date().toISOString().split('T')[0]}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-1 bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer w-full"
                required
              />
            </div>

            {/* Submit Action CTA */}
            <div className="sm:col-span-2 lg:col-span-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full h-12 sm:h-14 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 text-sm transition cursor-pointer"
              >
                <img src={assets.search} alt="search" className="w-4 h-4 brightness-200" />
                <span>{t('searchButton')}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
