import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets";
import Title from "../../Components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import { useLanguage } from "../../context/LanguageContext";
import { generateBookingInvoice } from "../../utils/invoiceGenerator";

const ManageBooking = () => {
  const { currency, axios } = useAppContext();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);

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
        toast.success(data.message || "Operator assigned successfully");
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

  const PaymentSummary = ({ booking }) => (
    <div className="space-y-1">
      <p className="text-xl font-bold text-gray-900">{currency}{booking.price}</p>
      {booking.paymentStatus === 'advance_paid' ? (
        <>
          <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold px-2 py-1 rounded-full">
            20% token: {currency}{booking.advanceAmount || Math.round(booking.price * 0.2)}
          </span>
          <p className="text-xs text-gray-500">Due on field: {currency}{booking.price - (booking.advanceAmount || Math.round(booking.price * 0.2))}</p>
        </>
      ) : booking.paymentStatus === 'fully_paid' ? (
        <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2 py-1 rounded-full">Full paid online</span>
      ) : (
        <span className="inline-block bg-gray-100 text-gray-700 border border-gray-200 text-[11px] font-medium px-2 py-1 rounded-full">Pay on delivery</span>
      )}
    </div>
  );

  const StatusControl = ({ booking }) => (
    <select
      value={booking.status}
      onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
      aria-label="Booking status"
      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none font-semibold transition cursor-pointer shadow-2xs ${
        booking.status === "confirmed"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : booking.status === "cancelled"
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );

  return (
    <div className="mx-4 sm:mx-6 md:mx-4 py-6 sm:py-8 w-auto min-w-0 max-w-6xl">
      <Title
        title="Manage Bookings & Drivers"
        subtitle="Track bookings, manage multi-unit pricing & deposits, assign certified operators, and download invoices"
      />

      <div className="w-full rounded-2xl overflow-hidden border border-borderColor mt-6 bg-white shadow-xs">
        <div className="divide-y divide-borderColor md:hidden">
          {bookings.map((booking) => (
            <article key={booking._id} className="p-4 space-y-4">
              <div className="flex gap-3">
                <img
                  src={booking.tractor?.image || assets.Ace}
                  alt={`${booking.tractor?.brand || 'Tractor'} ${booking.tractor?.model || ''}`}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover bg-gray-100 border border-gray-200"
                  onError={(e) => { e.target.src = assets.Ace || assets.download1; }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 leading-tight break-words">{booking.tractor ? `${booking.tractor.brand} ${booking.tractor.model}` : 'Tractor (Removed)'}</p>
                  <p className="mt-1 text-xs text-gray-500">ID: {booking._id?.slice(-6)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {booking.tractor?.horsePower && <span className="bg-primary/10 text-primary font-bold text-[10px] px-2 py-1 rounded">{booking.tractor.horsePower} HP</span>}
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-1 rounded-full border border-blue-100">{booking.unitsBooked || 1} {booking.rentalUnit === 'hour' ? 'Hour(s)' : booking.rentalUnit === 'acre' ? 'Acre(s)' : 'Day(s)'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-3 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Schedule</p>
                  <p className="mt-1 text-sm font-medium text-gray-800">{booking.startDate?.split('T')[0]} to {booking.endDate?.split('T')[0]}</p>
                  {booking.transportDistanceKm > 0 && <p className="mt-1 text-xs text-amber-700">Delivery: {booking.transportDistanceKm} km (+{currency}{booking.transportPrice})</p>}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Payment</p>
                  <div className="mt-1"><PaymentSummary booking={booking} /></div>
                </div>
              </div>

              {booking.selectedImplements?.length > 0 && <div className="flex flex-wrap gap-1.5">{booking.selectedImplements.map((imp, index) => <span key={index} className="bg-gray-100 text-gray-700 text-[11px] px-2 py-1 rounded border border-gray-200">+ {imp.name}</span>)}</div>}

              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">Operator</p>
                {booking.operatorAssigned?.name ? (
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-emerald-800">{booking.operatorAssigned.name} <span className="font-normal">({booking.operatorAssigned.phone || 'No phone'})</span></p>
                    <button onClick={() => openOperatorModal(booking)} className="self-start text-xs font-bold text-primary underline cursor-pointer">Edit operator</button>
                  </div>
                ) : <button onClick={() => openOperatorModal(booking)} className="mt-2 inline-flex items-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white cursor-pointer">Assign operator</button>}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Booking status</p><StatusControl booking={booking} /></div>
                <button onClick={() => generateBookingInvoice(booking, currency)} className="self-end w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer">Download PDF receipt</button>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="text-gray-500 bg-gray-50 border-b border-borderColor text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Tractor & Unit</th>
                <th className="p-4 font-semibold max-md:hidden">Customer</th>
                <th className="p-4 font-semibold max-lg:hidden">Schedule & Operator</th>
                <th className="p-4 font-semibold">Financials</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Receipt</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-borderColor">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Tractor info */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.tractor?.image || assets.Ace}
                        alt={`${booking.tractor?.brand || "Tractor"} ${booking.tractor?.model || ""}`}
                        className="h-14 w-14 rounded-xl object-cover bg-gray-100 border border-gray-200"
                        onError={(e) => { e.target.src = assets.Ace || assets.download1; }}
                      />
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">
                          {booking.tractor ? `${booking.tractor.brand} ${booking.tractor.model}` : "Tractor (Removed)"}
                        </p>
                        {booking.tractor?.horsePower && (
                          <span className="inline-block bg-primary/10 text-primary font-bold text-[10px] px-1.5 py-0.2 rounded mt-0.5">
                            ⚡ {booking.tractor.horsePower} HP
                          </span>
                        )}
                        <p className="text-[11px] text-gray-400 mt-0.5">ID: {booking._id?.slice(-6)}</p>
                        {/* Rental Unit Tag */}
                        <div className="mt-1">
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                            {booking.unitsBooked || 1} {booking.rentalUnit === 'hour' ? 'Hour(s)' : booking.rentalUnit === 'acre' ? 'Acre(s)' : 'Day(s)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Customer info */}
                  <td className="p-4 max-md:hidden">
                    <p className="font-semibold text-gray-800">{booking.user?.name || "Customer"}</p>
                    <p className="text-xs text-gray-500">{booking.user?.email || "-"}</p>
                    {booking.user?.phone && (
                      <p className="text-xs text-gray-400 mt-0.5">📞 {booking.user.phone}</p>
                    )}
                    {booking.transportDistanceKm > 0 && (
                      <div className="mt-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 inline-block">
                        🚚 Delivery: {booking.transportDistanceKm} km (+{currency}{booking.transportPrice})
                      </div>
                    )}
                  </td>

                  {/* Schedule & Operator */}
                  <td className="p-4 max-lg:hidden">
                    <p className="text-xs text-gray-800 font-medium">
                      📅 {booking.startDate?.split("T")[0]} to {booking.endDate?.split("T")[0]}
                    </p>

                    {/* Implements */}
                    {booking.selectedImplements && booking.selectedImplements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {booking.selectedImplements.map((imp, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">
                            + {imp.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Operator Assignment Display */}
                    <div className="mt-2">
                      {booking.operatorAssigned?.name ? (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-2 py-1 rounded-lg">
                          <span>👨‍🌾 {booking.operatorAssigned.name} ({booking.operatorAssigned.phone || "No phone"})</span>
                          <button
                            onClick={() => openOperatorModal(booking)}
                            className="text-emerald-700 hover:text-emerald-900 underline text-[10px] font-bold ml-1 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openOperatorModal(booking)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:bg-blue-100 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                        >
                          <span>👨‍🌾 {t('assignOperator')}</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Financials & Payment Status */}
                  <td className="p-4">
                    <p className="font-bold text-base text-gray-900 leading-tight">
                      {currency}{booking.price}
                    </p>
                    
                    {/* Payment breakdown badge */}
                    <div className="mt-1 space-y-0.5">
                      {booking.paymentStatus === 'advance_paid' ? (
                        <>
                          <span className="inline-block bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ 20% Token: {currency}{booking.advanceAmount || Math.round(booking.price * 0.2)}
                          </span>
                          <span className="block text-[10px] text-gray-500 font-medium">
                            Due on Field: {currency}{booking.price - (booking.advanceAmount || Math.round(booking.price * 0.2))}
                          </span>
                        </>
                      ) : booking.paymentStatus === 'fully_paid' ? (
                        <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          ✓ Full Paid Online
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          💵 Pay on Delivery
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Booking Status Dropdown */}
                  <td className="p-4">
                    <select
                      value={booking.status}
                      onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                      className={`px-2.5 py-1 text-xs rounded-lg border outline-none font-semibold transition cursor-pointer shadow-2xs ${
                        booking.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : booking.status === "cancelled"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Invoice action */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => generateBookingInvoice(booking, currency)}
                      className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1"
                      title="Download Official Tax Invoice PDF"
                    >
                      <span>📄 PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bookings.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm font-medium">No customer bookings received yet.</p>
          </div>
        )}
      </div>

      {/* Operator Assignment Modal */}
      {operatorModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90svh] overflow-y-auto p-4 sm:p-6 text-gray-800 animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Assign Certified Operator
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  For {operatorModalBooking.tractor?.brand} {operatorModalBooking.tractor?.model}
                </p>
              </div>
              <button
                onClick={() => setOperatorModalBooking(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignOperator} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Driver / Operator Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Patel"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-borderColor rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Driver Phone Number (for WhatsApp / Call)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={operatorPhone}
                  onChange={(e) => setOperatorPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-borderColor rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                💡 The customer will be able to see operator details and direct contact numbers directly inside their booking dashboard.
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setOperatorModalBooking(null)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="w-full sm:w-auto px-5 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isAssigning ? "Saving..." : "Save Operator"}
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
