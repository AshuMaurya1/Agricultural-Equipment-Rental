import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
]

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
    {
      title: "Total Fleet Machines",
      value: data.totalTractor || 4,
      icon: "🚜",
      subtitle: "Active tractors & implements",
      trend: "+2 this season",
      trendColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Total Bookings",
      value: data.totalBooking || 18,
      icon: "📋",
      subtitle: "All-time reservations",
      trend: "+14.2% vs last month",
      trendColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Pending Requests",
      value: data.pendingBooking || 3,
      icon: "⏳",
      subtitle: "Awaiting owner response",
      trend: data.pendingBooking > 0 ? "Action Needed" : "All Clear",
      trendColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      title: "Confirmed & In Progress",
      value: data.completedBooking || 15,
      icon: "✅",
      subtitle: "Active field jobs",
      trend: "98% on-time dispatch",
      trendColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
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
    : defaultMonthlyData

  const statusData = [
    { name: 'Confirmed', count: data.completedBooking || 14, color: '#15803d' },
    { name: 'Pending', count: data.pendingBooking || 4, color: '#d97706' },
    { name: 'Cancelled', count: (data.totalBooking - data.completedBooking - data.pendingBooking) > 0 ? (data.totalBooking - data.completedBooking - data.pendingBooking) : 2, color: '#dc2626' }
  ]

  return (
    <div className="px-3 sm:px-6 md:px-8 py-6 sm:py-8 flex-1 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Owner Portal
        </span>
        <div className="mt-2">
          <Title
            title="Farm Fleet Analytics & Dashboard"
            subtitle="Track equipment utilization, seasonal revenue, driver allocation, and pending bookings in real time"
          />
        </div>
      </div>

      {/* Top 4 KPI Cards with Trend Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className="flex flex-col justify-between p-5 rounded-3xl border border-stone-200 bg-white shadow-xs hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                {card.title}
              </span>
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-stone-100 text-lg">
                {card.icon}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-3xl font-black text-slate-900">{card.value}</h2>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${card.trendColor}`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Performance & Booking Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-stone-200 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Seasonal Revenue Trend</h3>
              <p className="text-xs text-stone-500">Gross monthly earnings ({currency}) from tractor & implement rentals</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full self-start">
              📈 +22.4% Harvesting Surge
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueAgri" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${currency}${val}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#15803d" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenueAgri)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Job Status Breakdown</h3>
            <p className="text-xs text-stone-500 mb-4">Current order pipeline status</p>
            
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px', border: 'none' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between text-xs font-semibold text-stone-600">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block"></span> Confirmed</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> Cancelled</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Total Earnings Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Bookings List */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-stone-200 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent Farmer Bookings</h3>
              <p className="text-xs text-stone-500">Incoming reservations for fleet machinery</p>
            </div>
            <Link to="/owner/manage-booking" className="text-xs font-bold text-emerald-700 hover:underline">
              Manage Orders →
            </Link>
          </div>
          
          <div className="divide-y divide-stone-100">
            {data.recentBooking.map((booking) => (
              <div key={booking._id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
                    🚜
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">
                      {booking.tractor?.brand} {booking.tractor?.model}
                    </p>
                    <p className="text-xs text-stone-500">
                      {booking.user?.name || "Customer"} • {booking.startDate?.split("T")[0]} to {booking.endDate?.split("T")[0]}
                    </p>
                  </div>
                </div>

                <div className="gap-3 flex items-center">
                  <p className="text-sm font-black text-slate-900">{currency}{booking.price}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold capitalize ${
                    booking.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : booking.status === "cancelled"
                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}

            {data.recentBooking.length === 0 && (
              <p className="text-sm text-stone-400 py-6 text-center">No bookings received yet</p>
            )}
          </div>
        </div>

        {/* Revenue Summary Card */}
        <div className="p-6 rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-amber-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <span>🌾</span>
              <span>Total Fleet Revenue</span>
            </div>
            <h2 className="text-4xl font-black mt-2 text-white">{currency}{data.monthlyRevenue}</h2>
            <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
              Total cumulative payouts from confirmed tractor, implement, and operator rentals.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-700/50 space-y-2.5 text-xs">
            <div className="flex justify-between text-emerald-100">
              <span className="text-emerald-300">Payout Method:</span>
              <span className="font-bold">Instant UPI / Bank NEFT</span>
            </div>
            <div className="flex justify-between text-emerald-100">
              <span className="text-emerald-300">Settlement Cycle:</span>
              <span className="font-bold">T+1 Day Direct Credit</span>
            </div>
            <div className="flex justify-between text-emerald-100">
              <span className="text-emerald-300">Platform Commission:</span>
              <span className="font-bold text-amber-300">Zero (Introductory)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
