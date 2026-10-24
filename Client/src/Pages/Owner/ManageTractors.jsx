import { useCallback, useEffect, useState } from "react";
import Title from "../../Components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const ManageTractors = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [tractors, setTractors] = useState([]);
  const [editingTractor, setEditingTractor] = useState(null);
  const [calendarTractor, setCalendarTractor] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOwnerTractors = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/owner/tractors');
      if (data.success) {
        setTractors(data.tractors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [axios]);

  useEffect(() => {
    if (isOwner) fetchOwnerTractors();
  }, [isOwner, fetchOwnerTractors]);

  // Toggle availability
  const toggleAvailability = async (tractorId) => {
    try {
      const { data } = await axios.put(`/api/owner/tractors/${tractorId}/availability`);
      if (data.success) {
        toast.success(data.message);
        fetchOwnerTractors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Toggle Blocked Date for Maintenance
  const toggleBlockDate = async (tractorId, dateStr) => {
    try {
      const { data } = await axios.post(`/api/owner/tractors/${tractorId}/block-date`, { date: dateStr });
      if (data.success) {
        toast.success(data.message);
        setCalendarTractor((prev) => (prev ? { ...prev, blockedDates: data.blockedDates } : null));
        fetchOwnerTractors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Delete tractor
  const deleteTractor = async (tractorId) => {
    try {
      const shouldDelete = window.confirm('Are you sure you want to remove this machine from the platform?');
      if (!shouldDelete) return;

      const { data } = await axios.delete(`/api/owner/tractors/${tractorId}`);
      if (data.success) {
        toast.success(data.message);
        fetchOwnerTractors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle Edit form submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingTractor) return;

    try {
      setIsUpdating(true);
      const { data } = await axios.put(`/api/owner/tractors/${editingTractor._id}`, {
        pricePerDay: Number(editingTractor.pricePerDay),
        pricePerHour: Number(editingTractor.pricePerHour),
        pricePerAcre: Number(editingTractor.pricePerAcre),
        horsePower: Number(editingTractor.horsePower),
        location: editingTractor.location,
        description: editingTractor.description,
        category: editingTractor.category,
      });

      if (data.success) {
        toast.success(data.message);
        setEditingTractor(null);
        fetchOwnerTractors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-6 w-full max-w-7xl mx-auto">
      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
        Fleet Inventory
      </span>
      <div className="mt-2">
        <Title
          title="Fleet Equipment & Availability"
          subtitle="Manage active farm machines, block dates for routine servicing or private farm use, and update pricing"
        />
      </div>

      {/* Mobile Card View (< md) */}
      <div className="mt-6 space-y-4 md:hidden">
        {tractors.map((tractor, index) => (
          <div
            key={tractor._id || index}
            className="p-4 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={tractor.image}
                alt={`${tractor.brand} ${tractor.model}`}
                className="h-16 w-16 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                onError={(e) => {
                  e.target.src = assets.Ace || assets.download1;
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">
                    {tractor.brand} {tractor.model}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      tractor.isAvailable
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {tractor.isAvailable ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  ⚡ {tractor.horsePower || 50} HP · 📍 {tractor.location || "UP"}
                </p>
                <div className="mt-1 text-xs font-black text-slate-900">
                  {currency}{tractor.pricePerDay}<span className="text-stone-400 font-normal">/day</span>
                  <span className="text-[10px] text-stone-400 font-normal ml-1.5">
                    ({currency}{tractor.pricePerHour || 600}/hr · {currency}{tractor.pricePerAcre || 1200}/acre)
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Action Controls */}
            <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setCalendarTractor(tractor)}
                className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>📅</span>
                <span>Calendar Schedule</span>
              </button>

              <button
                title="Edit Machine Details"
                onClick={() => setEditingTractor({ ...tractor })}
                className="p-2 border border-stone-200 hover:bg-stone-100 rounded-xl transition cursor-pointer text-stone-600"
              >
                <img src={assets.Edit} alt="Edit" className="w-4 h-4 opacity-75" />
              </button>

              <button
                title={tractor.isAvailable ? "Pause Listings" : "Activate Listings"}
                onClick={() => toggleAvailability(tractor._id)}
                className="p-2 border border-stone-200 hover:bg-stone-100 rounded-xl transition cursor-pointer text-stone-600"
              >
                <img
                  src={tractor.isAvailable ? assets.Eye_close_icon : assets.Eye_icon}
                  alt="Toggle"
                  className="w-4 h-4 opacity-75"
                />
              </button>

              <button
                title="Delete Machine"
                onClick={() => deleteTractor(tractor._id)}
                className="p-2 border border-rose-200 hover:bg-rose-50 rounded-xl transition cursor-pointer text-rose-600"
              >
                <img src={assets.Delete_icon} alt="Delete" className="w-4 h-4 opacity-75" />
              </button>
            </div>
          </div>
        ))}

        {tractors.length === 0 && (
          <p className="p-8 text-center text-stone-500 text-sm bg-white rounded-3xl border border-stone-200">
            No tractors listed yet. Click "Add Tractor" to list your first machine.
          </p>
        )}
      </div>

      {/* Desktop / Tablet Table View (hidden on mobile, visible on >= md) */}
      <div className="hidden md:block max-w-6xl w-full rounded-3xl overflow-hidden border border-stone-200 mt-6 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-stone-600">
            <thead className="text-stone-500 bg-stone-50 border-b border-stone-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold">Equipment</th>
                <th className="p-4 font-bold max-lg:hidden">Category & Power</th>
                <th className="p-4 font-bold">Rental Rates</th>
                <th className="p-4 font-bold">Platform Status</th>
                <th className="p-4 font-bold text-center">Controls</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {tractors.map((tractor, index) => (
                <tr
                  key={tractor._id || index}
                  className="hover:bg-stone-50/60 transition-colors"
                >
                  <td className="p-4 flex items-center gap-3.5">
                    <img
                      src={tractor.image}
                      alt={`${tractor.brand} ${tractor.model}`}
                      className="h-14 w-14 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                      onError={(e) => {
                        e.target.src = assets.Ace || assets.download1;
                      }}
                    />

                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">
                        {tractor.brand} {tractor.model}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {tractor.year || 2023} • 📍 {tractor.location || "Uttar Pradesh"}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 max-lg:hidden">
                    <span className="text-xs font-semibold text-stone-700 block">{tractor.category}</span>
                    <span className="inline-block mt-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2 py-0.2 rounded-full">
                      ⚡ {tractor.horsePower || 50} HP
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-black text-slate-900 text-sm">{currency}{tractor.pricePerDay}</span>
                    <span className="text-xs text-stone-400 font-normal"> /day</span>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {currency}{tractor.pricePerHour || 600}/hr · {currency}{tractor.pricePerAcre || 1200}/acre
                    </p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1.5 ${
                        tractor.isAvailable
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${tractor.isAvailable ? "bg-emerald-600 animate-pulse" : "bg-rose-600"}`} />
                      {tractor.isAvailable ? "Active Online" : "Paused"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        title="Maintenance & Availability Calendar"
                        onClick={() => setCalendarTractor(tractor)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>📅</span>
                        <span>Calendar</span>
                      </button>

                      <button
                        title="Edit Machine Details"
                        onClick={() => setEditingTractor({ ...tractor })}
                        className="p-2 hover:bg-stone-100 rounded-xl transition cursor-pointer text-stone-600 hover:text-stone-900"
                      >
                        <img src={assets.Edit} alt="Edit" className="w-4 h-4 opacity-75 hover:opacity-100" />
                      </button>

                      <button
                        title={tractor.isAvailable ? "Pause Listings" : "Activate Listings"}
                        onClick={() => toggleAvailability(tractor._id)}
                        className="p-2 hover:bg-stone-100 rounded-xl transition cursor-pointer text-stone-600"
                      >
                        <img
                          src={tractor.isAvailable ? assets.Eye_close_icon : assets.Eye_icon}
                          alt="Toggle"
                          className="w-4 h-4 opacity-75 hover:opacity-100"
                        />
                      </button>

                      <button
                        title="Delete Machine"
                        onClick={() => deleteTractor(tractor._id)}
                        className="p-2 hover:bg-rose-50 rounded-xl transition cursor-pointer text-rose-600"
                      >
                        <img src={assets.Delete_icon} alt="Delete" className="w-4 h-4 opacity-75 hover:opacity-100" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tractors.length === 0 && (
          <p className="p-8 text-center text-stone-500 text-sm">No tractors listed yet. Click "Add Tractor" to list your first machine.</p>
        )}
      </div>

      {/* Edit Tractor Modal */}
      {editingTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-6 text-slate-800 relative animate-fadeIn max-h-[90vh] overflow-y-auto border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Edit {editingTractor.brand} {editingTractor.model}
              </h3>
              <button
                onClick={() => setEditingTractor(null)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Daily Rate ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingTractor.pricePerDay || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, pricePerDay: e.target.value })
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Hourly Rate ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingTractor.pricePerHour || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, pricePerHour: e.target.value })
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Per Acre ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingTractor.pricePerAcre || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, pricePerAcre: e.target.value })
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Engine Power (HP)
                  </label>
                  <input
                    type="number"
                    value={editingTractor.horsePower || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, horsePower: e.target.value })
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    District Location
                  </label>
                  <input
                    type="text"
                    value={editingTractor.location || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, location: e.target.value })
                    }
                    className="w-full border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-emerald-600 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editingTractor.description || ""}
                  onChange={(e) =>
                    setEditingTractor({ ...editingTractor, description: e.target.value })
                  }
                  className="w-full border border-stone-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-emerald-600 bg-stone-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingTractor(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Availability & Maintenance Calendar Modal (Responsive for all screens) */}
      {calendarTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 text-slate-800 relative animate-fadeIn max-h-[92vh] overflow-y-auto border border-stone-200">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3 mb-3 sm:mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Fleet Schedule
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                  {calendarTractor.brand} {calendarTractor.model} — Availability Calendar
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                  Tap any date to block or unblock it for servicing or field work
                </p>
              </div>
              <button
                onClick={() => setCalendarTractor(null)}
                className="text-stone-400 hover:text-stone-700 text-2xl font-bold cursor-pointer p-1"
              >
                &times;
              </button>
            </div>

            {/* Visual Legend */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 bg-stone-50 p-2.5 sm:p-3 rounded-2xl border border-stone-200">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-2xs"></span>
                <span>Open for Booking</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-2xs"></span>
                <span>Blocked (Maintenance)</span>
              </span>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1.5 text-center text-[10px] sm:text-[11px] font-bold text-stone-400 uppercase">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* 28-Day Interactive Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() + i);
                const dateStr = dateObj.toISOString().split('T')[0];
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const isBlocked = (calendarTractor.blockedDates || []).includes(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => toggleBlockDate(calendarTractor._id, dateStr)}
                    className={`p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition cursor-pointer flex flex-col items-center justify-between min-h-[58px] sm:min-h-[72px] ${
                      isBlocked
                        ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                        : 'bg-emerald-50/50 border-emerald-200 text-emerald-950 hover:border-emerald-500'
                    }`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-semibold text-stone-400">{monthName}</span>
                    <span className="text-sm sm:text-base font-black my-0.2 sm:my-0.5">{dayNum}</span>
                    <span
                      className={`text-[8px] sm:text-[9px] font-black px-1 sm:px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isBlocked ? 'bg-amber-300 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {isBlocked ? 'Blk' : 'Open'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-stone-100 mt-4">
              <span className="text-[11px] text-stone-500">
                Blocked dates automatically prevent customer conflict reservations
              </span>
              <button
                type="button"
                onClick={() => setCalendarTractor(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow-xs text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTractors;
