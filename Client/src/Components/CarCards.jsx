import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const CarCards = ({tractor}) => {

  const currency = '$'
  const navigate = useNavigate()

  return (

    <div onClick={() => {navigate(`/tractor-details/${tractor._id || tractor.id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
        <div className='relative h-48 overflow-hidden'>
            <img src={tractor.image} alt="car Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
             
        
            {tractor.isAvailable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>}
            <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
            <span className='font-semibold'>{currency}{tractor.pricePerDay}</span>
            <span className='text-sm text-white/80'> / day</span>
            </div>
        </div>

        <div className='p-4 sm:p-5'>
          <div className='flex justify-between items-start mb-2'>
            <div>
              <h3 className='text-lg font-medium'>{tractor.brand} {tractor.model}</h3>
              <p className='text-muted-foreground text-sm'>{tractor.category} . {tractor.year}</p>
            </div>
          </div>
          <div className='mt-4 grid grid-cols-2 gap-y-2 text-gray-600'>
            <div className='flex items-center text-sm text-muted-foreground'> 
              <img src={assets.user} alt="User"  className='h-4 mr-2'/>
              <span>{tractor.seatingCapacity} Seats</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'> 
              <img src={assets.fuelIcon} alt="Fuel"  className='h-4 mr-2'/>
              <span>{tractor.fuelType}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'> 
              <img src={assets.Gear} alt="Transmission"  className='h-4 mr-2'/>
              <span>{tractor.transmission}</span>
            </div>
            <div className='flex items-center text-sm text-muted-foreground'> 
              <img src={assets.Location_icon} alt="Transmission"  className='h-4 mr-2'/>
              <span>{tractor.location}</span>
            </div>
          </div>

        </div>

    </div>
  )
}
export default CarCards

