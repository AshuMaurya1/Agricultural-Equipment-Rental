import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

const TractorCard = ({ tractor }) => {
  const { currency } = useAppContext()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()

  const tractorId = tractor._id || tractor.id
  const hp = Number(tractor.horsePower || 50)
  const isAvailable = tractor.isAvailable ?? true
  const dailyPrice = tractor.pricePerDay || 1500
  const hourlyPrice = tractor.pricePerHour || 600
  const acrePrice = tractor.pricePerAcre || 1200
  const driveType = tractor.transmission?.toLowerCase().includes('auto') ? '4WD Dual' : '4WD / 2WD'

  const handleCardClick = () => {
    navigate(`/tractor-details/${tractorId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleWhatsAppInquiry = (e) => {
    e.stopPropagation()
    const text = encodeURIComponent(
      `Namaste, I am interested in renting the ${tractor.brand} ${tractor.model} (${hp} HP) from TractorHub.`
    )
    window.open(`https://wa.me/918000000000?text=${text}`, '_blank')
  }

  return (
    <div
      onClick={handleCardClick}
      className="agri-card group rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer relative shadow-xs hover:shadow-xl transition-all duration-300"
    >
      {/* Top Image & Floating Status Badges */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <img
          src={tractor.image}
          alt={`${tractor.brand} ${tractor.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          onError={(e) => {
            e.target.src = assets.Ace || assets.download1
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {/* Availability Badge */}
          {isAvailable ? (
            <span className="bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {t('availableNow')}
            </span>
          ) : (
            <span className="bg-rose-600/95 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {t('booked')}
            </span>
          )}

          {/* Horsepower Badge */}
          <span className="bg-slate-900/85 backdrop-blur-xs text-amber-300 border border-amber-500/30 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
            ⚡ {hp} HP
          </span>
        </div>

        {/* Top Right: Location Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
          <span>📍</span>
          <span>{tractor.location || 'Uttar Pradesh'}</span>
        </div>

        {/* Bottom Image Overlay: Multi-rate preview badge */}
        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 shadow-md text-right">
          <div className="font-extrabold text-base text-amber-400">
            {currency}{dailyPrice}
            <span className="text-xs text-stone-300 font-normal"> / {t('perDay')}</span>
          </div>
          <div className="text-[10px] text-stone-300">
            {currency}{hourlyPrice}/{t('perHour')} · {currency}{acrePrice}/{t('perAcre')}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Title & Star Rating */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {tractor.brand}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                {tractor.model}
              </h3>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 shrink-0">
              <span className="text-amber-500">★</span> {tractor.rating || 4.8}
            </span>
          </div>

          {/* Key Agricultural Machine Specifications */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-stone-400">⚙️</span>
              <span className="truncate">{driveType}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-stone-400">⛽</span>
              <span className="truncate">{tractor.fuelType || 'Diesel'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-stone-400">👨‍🌾</span>
              <span className="truncate">{lang === 'hi' ? 'ड्राइवर विकल्प' : 'Operator Opt.'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-stone-400">🚚</span>
              <span className="truncate">₹40/km {lang === 'hi' ? 'डिलीवरी' : 'Drop'}</span>
            </div>
          </div>

          {/* Implements Compatibility Tag */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60 font-medium">
            <span>🌾</span>
            <span className="truncate">
              Rotavator, Cultivator & MB Plough compatible
            </span>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
          <button
            type="button"
            className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            <span>{lang === 'hi' ? 'विवरण व बुकिंग' : 'View & Book'}</span>
            <span>→</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition text-xs font-bold flex items-center justify-center cursor-pointer"
            title="Inquire on WhatsApp"
          >
            💬
          </button>
        </div>
      </div>
    </div>
  )
}

export default TractorCard
