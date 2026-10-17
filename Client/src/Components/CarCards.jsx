import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'

const CarCards = ({ tractor }) => {
  const { currency } = useAppContext()
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
        navigate(`/tractor-details/${tractor._id || tractor.id}`)
        window.scrollTo(0, 0)
      }}
      className='group rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white border border-gray-100 flex flex-col h-full'
    >
      <div className='relative h-52 overflow-hidden bg-gray-100'>
        <img
          src={tractor.image}
          alt={`${tractor.brand} ${tractor.model}`}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          onError={(e) => {
            e.target.src = assets.Ace || assets.download1
          }}
        />

        <div className='absolute top-3 left-3 flex items-center gap-1.5'>
          {tractor.isAvailable ? (
            <span className='bg-green-600/90 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs'>
              {t('availableNow')}
            </span>
          ) : (
            <span className='bg-red-600/90 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-xs'>
              {t('booked')}
            </span>
          )}

          {/* Horsepower Badge */}
          <span className='bg-blue-950/80 backdrop-blur-xs text-blue-200 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs'>
            ⚡ {tractor.horsePower || 50} HP
          </span>
        </div>

        <div className='absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg shadow-sm'>
          <span className='font-semibold text-base'>{currency}{tractor.pricePerDay}</span>
          <span className='text-xs text-white/80'> / {t('perDay')}</span>
        </div>
      </div>

      <div className='p-4 sm:p-5 flex flex-col flex-1 justify-between'>
        <div>
          <div className='flex items-center justify-between gap-2'>
            <h3 className='text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors truncate'>
              {tractor.brand} {tractor.model}
            </h3>
            <span className='flex items-center gap-1 text-xs font-bold text-gray-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0'>
              <span className='text-amber-500'>★</span> {tractor.rating || 4.8}
            </span>
          </div>
          <p className='text-gray-500 text-sm mt-0.5'>{tractor.category} • {tractor.year}</p>

          {/* Hourly & Acre pricing pill */}
          <div className='flex items-center gap-2 mt-2 text-[11px] text-gray-500'>
            <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium'>
              {currency}{tractor.pricePerHour || 600}/{t('perHour')}
            </span>
            <span className='bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium'>
              {currency}{tractor.pricePerAcre || 1200}/{t('perAcre')}
            </span>
          </div>
        </div>

        <div className='mt-4 grid grid-cols-2 gap-y-2.5 text-gray-600 border-t border-gray-100 pt-3'>
          <div className='flex items-center text-xs text-gray-600'>
            <img src={assets.user} alt="Seats" className='h-3.5 mr-2 opacity-70' />
            <span>{tractor.seatingCapacity || 1} Seat</span>
          </div>
          <div className='flex items-center text-xs text-gray-600'>
            <img src={assets.fuelIcon} alt="Fuel" className='h-3.5 mr-2 opacity-70' />
            <span>{tractor.fuelType}</span>
          </div>
          <div className='flex items-center text-xs text-gray-600'>
            <img src={assets.Gear} alt="Transmission" className='h-3.5 mr-2 opacity-70' />
            <span>{tractor.transmission}</span>
          </div>
          <div className='flex items-center text-xs text-gray-600'>
            <img src={assets.Location_icon} alt="Location" className='h-3.5 mr-2 opacity-70' />
            <span className='truncate'>{tractor.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCards
