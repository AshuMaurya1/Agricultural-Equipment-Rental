import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";
import Title from "../../Components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import { generateBookingInvoice } from "../../utils/invoiceGenerator";

const stepsList = [
  { id: "pending", label: "Request Placed", icon: "📝" },
  { id: "confirmed", label: "Confirmed", icon: "✅" },
  { id: "operator", label: "Operator Assigned", icon: "👨‍🌾" },
  { id: "dispatched", label: "Dispatched to Field", icon: "🚜" },
  { id: "completed", label: "Job Completed", icon: "🌾" },
];

const ManageBooking = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  // Operator assignment modal state
  const [operatorModalBooking, setOperatorModalBooking] = useState(null);
  const [operatorName, setOperatorName] = useState("");
  const [operatorPhone, setOperatorPhone] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchOwnerBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/booking/owner');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [axios]);

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/booking/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const openOperatorModal = (booking) => {
    setOperatorModalBooking(booking);
    setOperatorName(booking.operatorAssigned?.name || "");
    setOperatorPhone(booking.operatorAssigned?.phone || "");
  };

  const handleAssignOperator = async (e) => {
    e.preventDefault();
    if (!operatorModalBooking) return;
    try {
      setIsAssigning(true);
      const { data } = await axios.post(
        `/api/owner/bookings/${operatorModalBooking._id}/assign-operator`,
        { name: operatorName, phone: operatorPhone }
      );
      if (data.success) {
        toast.success(data.message);
        setOperatorModalBooking(null);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [fetchOwnerBookings]);

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  const getStepIndex = (booking) => {
    if (booking.status === "cancelled") return -1;
    if (booking.status === "pending") return 0;
    if (booking.status === "confirmed") {
      if (!booking.operatorAssigned?.name) return 1;
      const end = new Date(booking.endDate);
      const now = new Date();
      if (now > end) return 4; // completed
      const start = new Date(booking.startDate);
      if (now >= start) return 3; // dispatched
      return 2; // operator assigned
    }
    return 1;
  };

  return (
    <div className="mx-4 sm:mx-6 md:mx-8 py-8 w-auto min-w-0 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Fleet Operations
          </span>
          <div className="mt-2">
            <Title
              title="Booking Pipeline & Driver Assignment"
              subtitle="Monitor field orders through live status steppers, allocate certified operators, and issue invoices"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-bold self-start sm:self-auto">
          {["all", "pending", "confirmed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl capitalize transition cursor-pointer ${
                filterStatus === status
                  ? "bg-white text-emerald-800 shadow-xs font-extrabold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Cards with Interactive Stepper */}
      <div className="mt-8 space-y-6">
        {filteredBookings.map((booking) => {
          const currentStep = getStepIndex(booking);
          const isCancelled = booking.status === "cancelled";

          return (
            <div
              key={booking._id}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-5 sm:p-6"
            >
              {/* Top Row: Machine Info, Dates & Financials */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-stone-100">
                <div className="flex items-start gap-4">
                  <img
                    src={booking.tractor?.image || assets.Ace}
                    alt=""
                    className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl object-cover bg-stone-100 border border-stone-200"
                    onError={(e) => {
                      e.target.src = assets.Ace || assets.download1;
                    }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {booking.tractor ? `${booking.tractor.brand} ${booking.tractor.model}` : "Tractor (Removed)"}
                      </h3>
                      {booking.tractor?.horsePower && (
                        <span className="bg-amber-100/80 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          ⚡ {booking.tractor.horsePower} HP
                        </span>
                      )}
                      <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-stone-200">
                        {booking.unitsBooked || 1} {booking.rentalUnit === 'hour' ? 'Hour(s)' : booking.rentalUnit === 'acre' ? 'Acre(s)' : 'Day(s)'}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 mt-1">
                      <span className="font-bold text-stone-700">Customer:</span> {booking.user?.name || "Farmer"} ({booking.user?.email || "No email"}) {booking.user?.phone ? `• 📞 ${booking.user.phone}` : ""}
                    </p>

                    <p className="text-xs text-stone-500 mt-0.5">
                      <span className="font-bold text-stone-700">Schedule:</span> 📅 {booking.startDate?.split("T")[0]} to {booking.endDate?.split("T")[0]}
                    </p>

                    {booking.transportDistanceKm > 0 && (
                      <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg mt-1.5">
                        🚚 Field Delivery: {booking.transportDistanceKm} km (+{currency}{booking.transportPrice})
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Financials & Action Buttons */}
                <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between gap-3 text-right">
                  <div>
                    <span className="text-2xl font-black text-slate-900">{currency}{booking.price}</span>
                    <div className="mt-1">
                      {booking.paymentStatus === 'advance_paid' ? (
                        <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          ✓ 20% Token: {currency}{booking.advanceAmount || Math.round(booking.price * 0.2)}
                        </span>
                      ) : booking.paymentStatus === 'fully_paid' ? (
                        <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          ✓ Full Paid Online
                        </span>
                      ) : (
                        <span className="inline-block bg-stone-100 text-stone-700 border border-stone-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          💵 Pay on Delivery
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateBookingInvoice(booking, currency)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                      title="Download PDF"
                    >
                      📄 Receipt
                    </button>

                    {booking.status === "pending" && (
                      <button
                        onClick={() => changeBookingStatus(booking._id, "confirmed")}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-xs transition cursor-pointer"
                      >
                        Approve Booking
                      </button>
                    )}

                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => changeBookingStatus(booking._id, "cancelled")}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Section: Visual Status Stepper */}
              <div className="py-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-3">
                  Job Lifecycle Stepper
                </span>

                {isCancelled ? (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <span>❌</span>
                    <span>This booking was cancelled. Dates have been released for the fleet.</span>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-stone-200 z-0" />
                    
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
                      {stepsList.map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div
                            key={step.id}
                            className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center ${
                              isCurrent
                                ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20 scale-102"
                                : isDone
                                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                                : "bg-stone-50 text-stone-400 border-stone-200"
                            }`}
                          >
                            <span className="text-xl mb-1">{step.icon}</span>
                            <span className="text-[11px] font-extrabold leading-tight">{step.label}</span>
                            <span className="text-[9px] mt-0.5 font-bold uppercase opacity-80">
                              {isCurrent ? "Active Step" : isDone ? "Completed" : "Upcoming"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Row: Implements Attached & Driver Allocation */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Implements List */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-stone-500">Implements:</span>
                  {booking.selectedImplements?.length > 0 ? (
                    booking.selectedImplements.map((imp, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-lg border border-stone-200 font-medium"
                      >
                        + {imp.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 italic">Standard machine only</span>
                  )}
                </div>

                {/* Operator Allocation Card */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-500">Operator:</span>
                  {booking.operatorAssigned?.name ? (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-xl font-bold">
                      <span>👨‍🌾 {booking.operatorAssigned.name}</span>
                      {booking.operatorAssigned.phone && (
                        <a href={`tel:${booking.operatorAssigned.phone}`} className="text-emerald-700 underline font-semibold ml-1">
                          {booking.operatorAssigned.phone}
                        </a>
                      )}
                      <button
                        onClick={() => openOperatorModal(booking)}
                        className="text-stone-400 hover:text-stone-700 ml-1.5 cursor-pointer text-[10px]"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openOperatorModal(booking)}
                      className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs transition cursor-pointer"
                    >
                      + Assign Driver / Operator
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
            <span className="text-3xl">📋</span>
            <p className="mt-2 text-sm font-bold text-slate-800">No bookings found in this status</p>
          </div>
        )}
      </div>

      {/* Operator Assignment Modal */}
      {operatorModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-slate-800 relative animate-fadeIn border border-stone-200">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Assign Certified Operator
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Allocate an experienced local driver to handle field operations
                </p>
              </div>
              <button
                onClick={() => setOperatorModalBooking(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignOperator} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Operator Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Yadav"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Contact Mobile Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={operatorPhone}
                  onChange={(e) => setOperatorPhone(e.target.value)}
                  className="w-full border border-stone-200 px-3 py-2 rounded-xl text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setOperatorModalBooking(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs text-stone-600 hover:bg-stone-50 cursor-pointer font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer disabled:opacity-50"
                >
                  {isAssigning ? "Assigning..." : "Confirm Operator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooking;
