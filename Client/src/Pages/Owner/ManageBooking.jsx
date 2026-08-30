import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";
import Title from "../../Components/owner/Title";
import { useAppContext } from "../../context/AppContext";

const tractorImages = [
  assets.download1,
  assets.download2,
  assets.download3,
  assets.download4,
  assets.download5,
  assets.download6,
  assets.download7,
];

const ManageBooking = () => {

  const {currency, axios} = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = useCallback(async () => {
    try{
      const {data} = await axios.get('/api/booking/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch(error){
      toast.error(error.message)
    }
  }, [axios])

  const changeBookingStatus = async (bookingId, status) => {
    try{
      const {data} = await axios.post('/api/booking/change-status', {bookingId, status})
      if(data.success){
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
      toast.error(data.message)
      }
    } catch(error){
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [fetchOwnerBookings])

  return (
    <div className="mx-4 py-10 w-full">
      <Title
        title="Manage Booking"
        subtitle="Track all customer bookings, approve or cancel booking requests, and manage booking statuses."
      />

      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Tractor</th>
              <th className="p-3 font-medium max-md:hidden">Date Range </th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="border-t border-borderColor text-gray-500">
                <td className="p-3 flex items-center gap-3">
                  <img src={booking.tractor?.image || tractorImages[index % tractorImages.length]} alt={`${booking.tractor?.brand || "Tractor"} ${booking.tractor?.model || ""}`} className="h-12 w-12 rounded-md object-cover"/>
                  <p className="font-medium max-md:hidden">{booking.tractor?.brand} {booking.tractor?.model}</p></td>

                <td className="p-3 max-md:hidden">{booking.startDate?.split("T")[0]} to{" "}{booking.endDate?.split("T")[0]}</td>

                <td className="p-3">{currency}{booking.price}</td>

                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">Offline</span>
                </td>

                <td className="p-3">
                  {booking.status === "pending" ? (
                    <select value={booking.status} onChange={(e) =>changeBookingStatus(booking._id,e.target.value)} className="px-2 py-1.5 text-gray-500 border border-borderColor rounded-md outline-none">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === "confirmed"? "bg-green-100 text-green-600": "bg-red-100 text-red-600"}`}>{booking.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooking;
