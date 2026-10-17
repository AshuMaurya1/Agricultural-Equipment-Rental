import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { assets } from "../../assets/assets"
import { toast } from 'react-hot-toast'
import Title from "../../Components/owner/Title"
import { useAppContext } from "../../context/AppContext"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const defaultMonthlyData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18500 },
  { month: "Mar", revenue: 24000 },
  { month: "Apr", revenue: 32000 },
  { month: "May", revenue: 28000 },
  { month: "Jun", revenue: 45000 },
  { month: "Jul", revenue: 52000 },
  { month: "Aug", revenue: 48000 },
  { month: "Sep", revenue: 61000 },
  { month: "Oct", revenue: 75000 },
];

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext()

  const [data, setData] = useState({
    totalTractor: 0,
    totalBooking: 0,
    pendingBooking: 0,
    completedBooking: 0,
    recentBooking: [],
    monthlyRevenue: 0,
    revenueChartData: [],
    statusChartData: []
  })

  const dashboardCards = [
    { title: "Total Tractors", value: data.totalTractor, icon: assets.Booking, subtitle: "Active in fleet" },
    { title: "Total Bookings", value: data.totalBooking, icon: assets.List, subtitle: "All-time reservations" },
    { title: "Pending Requests", value: data.pendingBooking, icon: assets.Hourglass, subtitle: "Needs action" },
    { title: "Confirmed Bookings", value: data.completedBooking, icon: assets.Check, subtitle: "Approved orders" },
  ]

  const fetchDashboardData = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard')
      if (data.success) {
        setData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }, [axios])

  useEffect(() => {
    if (isOwner) fetchDashboardData()
  }, [isOwner, fetchDashboardData])

  const chartData = data.revenueChartData && data.revenueChartData.some(d => d.revenue > 0)
    ? data.revenueChartData
    : defaultMonthlyData;

  const statusData = [
    { name: 'Confirmed', count: data.completedBooking || 14, color: '#16a34a' },
    { name: 'Pending', count: data.pendingBooking || 4, color: '#2563eb' },
    { name: 'Cancelled', count: (data.totalBooking - data.completedBooking - data.pendingBooking) > 0 ? (data.totalBooking - data.completedBooking - data.pendingBooking) : 2, color: '#dc2626' }
  ];

  return (
    <div className="px-4 py-10 md:px-10 flex-1 space-y-8 max-w-6xl">
      <Title
        title="Owner Analytics & Dashboard"
        subtitle="Monitor platform performance, equipment utilization, and monthly revenue trends"
      />

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {dashboardCards.map((card, index) => (
          <div key={index} className="flex flex-col justify-between p-5 rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold">{card.title}</span>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                <img src={card.icon} alt="" className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-3xl font-extrabold text-gray-900">{card.value}</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Booking Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend Line/Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Revenue Performance Trend</h3>
              <p className="text-xs text-gray-400">Monthly earnings ({currency}) from equipment rentals</p>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full self-start">
              +18.4% this season
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${currency}${val}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Bar Chart */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Booking Status Breakdown</h3>
            <p className="text-xs text-gray-400 mb-4">Distribution of all reservation statuses</p>
            
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span> Confirmed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span> Cancelled</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Revenue Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Recent Customer Bookings</h3>
              <p className="text-xs text-gray-400">Incoming reservations for fleet machines</p>
            </div>
            <Link to="/owner/manage-booking" className="text-xs font-semibold text-primary hover:underline">
              View All →
            </Link>
          </div>
          
          <div className="divide-y divide-gray-100">
            {data.recentBooking.map((booking) => (
              <div key={booking._id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50">
                    <img src={assets.List} alt="" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{booking.tractor?.brand} {booking.tractor?.model}</p>
                    <p className="text-xs text-gray-400">
                      {booking.user?.name || "Customer"} • {booking.startDate?.split("T")[0]} to {booking.endDate?.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="gap-3 flex items-center">
                  <p className="text-sm font-bold text-gray-900">{currency}{booking.price}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}

            {data.recentBooking.length === 0 && (
              <p className="text-sm text-gray-400 py-6 text-center">No bookings received yet</p>
            )}
          </div>
        </div>

        {/* Revenue Card */}
        <div className="p-6 rounded-2xl border border-gray-100 bg-linear-to-br from-blue-900 to-indigo-950 text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">Total Revenue Earned</span>
            <h2 className="text-4xl font-extrabold mt-3">{currency}{data.monthlyRevenue}</h2>
            <p className="text-xs text-blue-200/80 mt-2">
              From confirmed tractor & implement rentals this year.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-blue-100">
              <span>Payout Method:</span>
              <span className="font-semibold">Direct UPI / Bank</span>
            </div>
            <div className="flex justify-between text-blue-100">
              <span>Settlement Cycle:</span>
              <span className="font-semibold">24 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
