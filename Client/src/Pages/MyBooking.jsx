import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import {motion} from 'motion/react'

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "-";

const MyBooking = () => {

  const { axios, currency, user} = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchMyBooking = useCallback(async () => {
    try{
      const {data} = await axios.get('/api/booking/user')
      if(data.success){
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.response?.data?.message || error.message)
    }
  }, [axios])

  useEffect(() => {
    if (user) fetchMyBooking();
    else setBookings([]);
  }, [user, fetchMyBooking]);
 
  return (
    <motion.div 
    initial={{opacity: 0, y: 30}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.6}}
    className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl">
      <Title title="My Bookings" subtitle="View and manage all your tractor bookings" align="left" />

      <div>
        {bookings.map((booking, index) => (
          <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.5, duration: 0.4}}

          key={booking._id} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12">
            <div className="rounded-md overflow-hidden bg-light">
              <img
                src={booking.tractor?.image || assets.download1}
                alt={`${booking.tractor?.brand || "Tractor"} ${booking.tractor?.model || ""}`}
                className="w-full aspect-video object-cover"
              />
            </div>

            <div className="md:col-span-2">
              <p className="text-lg font-medium">{booking.tractor?.brand} {booking.tractor?.model}</p>
              <p className="text-gray-500">Booking ID: {booking._id}</p>
              <p className="text-gray-500">{formatDate(booking.startDate)} to {formatDate(booking.endDate)}</p>
            </div>

            <div className="md:text-right">
              <p className="font-medium">{currency}{booking.price}</p>
              <p className={`mt-2 capitalize ${booking.status === "confirmed" ? "text-green-600" : booking.status === "cancelled" ? "text-red-600" : "text-primary"}`}>
                {booking.status}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">You have no bookings yet.</p>
      ) : (
        <p className="mt-4 text-gray-500">{bookings.length} bookings found.</p>
      )}
    </motion.div>
  );
};

export default MyBooking;
