import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets"
import Loader from "../Components/Loader"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"
import {motion} from 'motion/react'

const TractorDetails = () => {

  const {id} = useParams()
  const { tractors, currency, axios, pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext()

  const navigate = useNavigate()
  const tractor = tractors.find((item) => (item._id || item.id) === id)
  const handelSubmit = async(e) => {
    e.preventDefault();
    try{
      const {data} = await axios.post('/api/booking/create', {
        tractorId: id,
        startDate: pickupDate,
        endDate: returnDate
      })
      if(data.success){
        toast.success(data.message)
        navigate('/mybooking')
      } else {
        toast.error(data.message)
      }
    } catch(error){
        toast.error(error.message)
    }
  }

  return tractor ? (

    <div className="px-6 md:px-24 xl:px-32 mt-16">
      <button className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer " onClick={() => navigate(-1)}>
        <img src={assets.Arrow_icon} alt=""  className="rotate-180 opacity-65"/>
        Back to all tractors
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* Left : tractor Image & Detals */}


        <motion.div 
        initial={{opacity: 0, scale: 0.98}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.6}}

        className="lg:col-span-2 ">
          <motion.img 
          initial={{opacity: 0}}
          animate={{opacity: 1,}}
          transition={{duration: 0.6, delay: 0.2}}
          src={tractor.image} alt=""  className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"/>
          <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}} 
          className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{tractor.brand} {tractor.model}</h1>
              <p className="text-gray-500 text-lg">{tractor.category} . {tractor.year}</p>
            </div>
            <hr className="border-borderColor my-6"/>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {icon: assets.user, text: `${tractor.seatingCapacity} seats`},
                {icon: assets.fuelIcon, text:tractor.fuelType},
                {icon: assets.Gear, text:tractor.transmission},
                {icon: assets.Location_icon, text:tractor.location}
              ].map(({icon, text}) =>(
                <motion.div 
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4}}
                key={text} className="flex flex-col bg-light p-4 rounded-lg">
                  <img src={icon} alt="" className=" h-5 mb-2" />
                  {text}
                </motion.div>
              )) }
            </div>


            {/* Description */}


            <div>
              <h1 className="text-xl font-medium mb-3">Discription</h1>
              <p className=" text-gray-500">{tractor.description}</p>
            </div>

            {/* Features  */}


            <div>
              <h1 className="text-xl font-medium mb-3">Features</h1>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {
                  ["360 camera", "Bluetooth", "GPS", "Heated Seats","Rear Viev", "mirror"].map((item) =>(
                    <li key={item} className="flex items-center text-gray-500">
                      <img src={assets.Check} alt=""  className="h-4 mr-2"/>
                      {item}
                    </li>
                  ))
                }
              </ul>

            </div>
          </motion.div>
        </motion.div>

        {/* Rigth : Booking Form  */}


        <motion.form 
        initial={{opacity: 0, y: 30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.3}}

        onSubmit={handelSubmit} className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-550">
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">{currency}{tractor.pricePerDay} <span className="text-base text-gray-400 font-normal">Per Day</span></p>
          <hr className="border-borderColor my-6"/>

          <div className="flex flex-col gap-2">
            <label htmlFor="Pickup-date">Pickup Date</label>
            <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" className=" border border-borderColor px-3 py-2 rounded-lg" required id="Pickup-date" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="return-date">Return Date</label>
            <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} type="date" className="border border-borderColor px-3 py-2 rounded-lg" required id="return-date" min={pickupDate || new Date().toISOString().split('T')[0]} />
          </div>
          <button className="w-full bg-primary hover:bg-primary-dull trasition py-3 font-medium text-white rounded-xl cursor-pointer">Book Now</button>

          <p className="text-center text-sm">No credit card required to reserve</p>

        </motion.form>
      </div>
        
    </div>
  ) : <Loader/>
}

export default TractorDetails
