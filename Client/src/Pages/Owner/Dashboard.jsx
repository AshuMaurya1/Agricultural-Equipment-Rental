import { useCallback, useEffect, useState } from "react"
import { assets } from "../../assets/assets"
import { toast } from 'react-hot-toast'
import Title from "../../Components/owner/Title"
import { useAppContext } from "../../context/AppContext"

const Dashboard = () => {

  const {axios, isOwner, currency} = useAppContext()

  const [data, setData] = useState({
    totalTractor: 0,
    totalBooking: 0,
    pendingBooking: 0,
    completedBooking: 0,
    recentBooking: [],
    monthlyRevenue: 0,
  })

  const dashboardCards = [
  {title : "Total Tractor" , value : data.totalTractor , icon : assets.Car},
  {title : "Total Booking" , value : data.totalBooking , icon : assets.List},
  {title : "Pending" , value : data.pendingBooking , icon : assets.Hourglass},
  {title : "Confirmed" , value : data.completedBooking , icon : assets.List}
]

const fetchDashboardData = useCallback(async() =>{
  try{
    const {data} = await axios.get('/api/owner/dashboard')
    if(data.success){
      setData(data.dashboardData)
    } else{
      toast.error(data.message)
    }
  }catch(error){
      toast.error(error.response?.data?.message || error.message)

  }
}, [axios])

useEffect(() =>{
  if (isOwner) fetchDashboardData()
}, [isOwner, fetchDashboardData])

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title title="Admin DashBoard" subtitle=" Monitor overall platform performance including total Tractors , revenue, and reecent activities"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl">
        {dashboardCards.map ((card, index) =>(
          <div key={index} className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor">
            <div>
              <h1 className="text-xs text-gray-500">{card.title}</h1>
              <h1 className="text-lg font-semibold">{card.value}</h1>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <img src={card.icon} alt="" className="h-4 w-4"/>
            </div>
          </div>
        ))}
      </div>


      <div className="flex flex-wrap items-start gap-6 mb-8 w-full">
        {/* Recent Booking  */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full">
          <h1 className="text-lg font-medium">Recent Booking</h1>
          <p className="text-gray-500">latest costomer booking</p>
          {data.recentBooking.map((booking) => (
            <div key={booking._id} className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <img src={assets.List} alt=" " className="h-5 w-5"/>
                </div>
                <div>
                  <p>{booking.tractor?.brand} {booking.tractor?.model}</p>
                  <p className="text-sm text-gray-500">{booking.startDate?.split("T")[0]} to {booking.endDate?.split("T")[0]}</p>
                </div>
              </div>

              <div className="gap-2 flex items-center font-medium">
                <p className="text-sm text-gray-500">{currency}{booking.price}</p>
                <p className="px-3 py-0.5 border border-borderColor rounded-full text-sm">{booking.status}</p>
              </div>


            </div>
          ))}
        </div>
        {/* Monthy Revenue   */}
        <div className="p-4 md:p-6 border border-borderColor rounded-md w-full md:max-w-xs">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue for current month</p>
          <p className="text-3xl font-semibold text-primary">{currency}{data.monthlyRevenue}</p>
        </div>
      </div>
    </div>
  )
} 
export default Dashboard
