import { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { useLanguage } from '../context/LanguageContext'
import { motion } from 'motion/react'

const Hero = () => {
    const [pickupLocation, setPickupLocation] = useState('')
    const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();
    const { t } = useLanguage();

    const handleSearch = (e) => {
        e.preventDefault()
        const searchParams = new URLSearchParams({
            pickupLocation,
            pickupDate,
            returnDate,
        })
        navigate(`/tractor?${searchParams.toString()}`)
    }

  return (
    <motion.div
    initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration : 0.8}}
     className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
        <motion.h1 initial={{y: 50, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.8, delay: 0.2}}
        className='text-4xl md:text-5xl font-semibold'>{t('heroTitle')}</motion.h1>
        <motion.form 
        initial={{scale: 0.5, opacity: 0, y: 50}}
        animate={{scale: 1, opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.4}}
        onSubmit= {handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-2xl bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

            <div className='flex flex-col md:flex-row items-start md:items-center gap-4 md:ml-6'>
                <div className='flex flex-col items-start gap-0'>
                    <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
                        <option value="">{t('pickupLocation')}</option>
                        {cityList.map((city) => (
                            <option value={city.name} key={city.name}>{city.name}</option>
                        ))}
                    </select>
                    <p className='px-1 text-sm text-gray-500'>{pickupLocation ? pickupLocation : t('pickupLocationPlaceholder')}</p>
                </div>
                <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="pickup-date">{t('pickupDate')}</label>
                    <input value={pickupDate} onChange={e=>setPickupDate(e.target.value)} type="date" name="" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' required/>
                </div>
                 <div className='flex flex-col items-start gap-3'>
                    <label htmlFor="return-date">{t('returnDate')}</label>
                    <input value={returnDate} onChange={e=>setReturnDate(e.target.value)} type="date" name="" id="return-date" min={pickupDate || new Date().toISOString().split('T')[0]} className='text-sm text-gray-500' required/>
                </div>
                
            </div>
            <motion.button
            whileHover={{scale : 1.05}}
            whileTap={{scale: 0.95}}
            className='flex items-center justify-center gap-1 px-9 py-3 max-sm:mt-4 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer text-sm font-medium'>
                        <img src={assets.search}alt="search"className='brightness-200'/>{t('searchButton')}</motion.button>
        </motion.form>
        <motion.img 
        initial={{y:100, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.8, delay: 0.6}}
        src={assets.Ace} alt="tractor" className="w-96 h-56 shadow-[0px_8px_20px_rgba(0,0,0,0.1)] rounded-2xl" />
    </motion.div>
  )
}
export default Hero
