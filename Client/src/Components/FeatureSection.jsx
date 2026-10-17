import Title from './Title'
import CarCards from './CarCards'
import { assets, dummyTractorData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const FeatureSection = () => {
    const navigate = useNavigate()
    const { tractors } = useAppContext();
    const displayList = tractors && tractors.length > 0 ? tractors.slice(0, 6) : dummyTractorData.slice(0, 6);

  return (
    <motion.div 
    initial={{opacity: 0, y : 40}}
    whileInView={{opacity: 1, y: 0}}
    transition={{duration : 1, ease: "easeOut"}}
    className='flex flex-col items-center py-20 px-6 md:px-16 lg:px-24 xl:px-32'>

        <motion.div
            initial={{opacity: 0, y : 20}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration : 0.8, delay : 0.2}}
        >
            <Title title='Featured Tractors' subtitle='Explore our selection of reliable, heavy-duty tractors available for your next harvest.'/>
        </motion.div>

        <motion.div
        initial={{opacity: 0, y: 60}}
        whileInView={{opacity: 1, y: 0}}
        transition={{duration: 0.8, delay: 0.3}}
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full max-w-7xl'>
            {
                displayList.map((tractor) => (
                    <motion.div
                    initial={{opacity: 0, scale: 0.98}}
                    whileInView={{opacity: 1, scale: 1}}
                    transition={{duration: 0.6, ease: 'easeOut'}}
                    key={tractor._id || tractor.id}>
                        <CarCards tractor={tractor}/> 
                    </motion.div>
                ))
            }
        </motion.div> 
        <motion.button 
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        transition={{delay: 0.4, duration: 0.4}}
        onClick={() => {
            navigate('/tractor'); window.scrollTo(0, 0)
        }} className='flex items-center justify-center gap-2 px-8 py-3 bg-white border border-borderColor hover:bg-gray-50 text-gray-700 font-medium rounded-xl mt-12 cursor-pointer shadow-xs hover:shadow-md transition'>
            Explore all tractors <img src={assets.Arrow_icon} alt="Arrow" className="w-4 h-4" />
        </motion.button>

    </motion.div>
  )
}

export default FeatureSection
