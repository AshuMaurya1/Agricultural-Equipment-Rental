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
        setCalendarTractor((prev) => prev ? { ...prev, blockedDates: data.blockedDates } : null);
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
      const shouldDelete = window.confirm('Are you sure you want to delete this tractor?');
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
    <div className="mx-4 py-10 w-full">
      <Title
        title="Manage Tractors"
        subtitle="View all listed tractors, update their details, or remove them from the booking platform"
      />

      <div className="max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6 bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500 bg-gray-50">
            <tr>
              <th className="p-3 font-medium">Tractor</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tractors.map((tractor, index) => (
              <tr
                key={tractor._id || index}
                className="border-t border-borderColor hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={tractor.image}
                    alt={`${tractor.brand} ${tractor.model}`}
                    className="h-12 w-12 rounded-md object-cover bg-gray-100"
                    onError={(e) => { e.target.src = assets.Ace || assets.download1; }}
                  />

                  <div>
                    <p className="font-medium text-gray-900">
                      {tractor.brand} {tractor.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {tractor.year} • {tractor.location}
                    </p>
                  </div>
                </td>

                <td className="p-3 max-md:hidden">
                  {tractor.category}
                </td>

                <td className="p-3 font-medium">
                  {currency}{tractor.pricePerDay} <span className="text-xs text-gray-400 font-normal">/day</span>
                </td>

                <td className="p-3 max-md:hidden">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tractor.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tractor.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      title="Availability & Maintenance Calendar"
                      onClick={() => setCalendarTractor(tractor)}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      📅 Calendar
                    </button>

                    <button
                      title="Edit Tractor"
                      onClick={() => setEditingTractor({ ...tractor })}
                      className="p-1 hover:bg-gray-100 rounded transition cursor-pointer"
                    >
                      <img src={assets.Edit} alt="Edit" className="w-4 h-4 opacity-75 hover:opacity-100" />
                    </button>

                    <button
                      title={tractor.isAvailable ? "Set Unavailable" : "Set Available"}
                      onClick={() => toggleAvailability(tractor._id)}
                      className="p-1 hover:bg-gray-100 rounded transition cursor-pointer"
                    >
                      <img
                        src={tractor.isAvailable ? assets.Eye_close_icon : assets.Eye_icon}
                        alt="Toggle"
                        className="w-4 h-4 opacity-75 hover:opacity-100"
                      />
                    </button>

                    <button
                      title="Delete Tractor"
                      onClick={() => deleteTractor(tractor._id)}
                      className="p-1 hover:bg-red-50 rounded transition cursor-pointer"
                    >
                      <img src={assets.Delete_icon} alt="Delete" className="w-4 h-4 opacity-75 hover:opacity-100" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tractors.length === 0 && (
          <p className="p-8 text-center text-gray-500 text-sm">No tractors listed yet. Click "Add Tractor" to add your first machine.</p>
        )}
      </div>

      {/* Edit Tractor Modal */}
      {editingTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-gray-700 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit {editingTractor.brand} {editingTractor.model}
              </h3>
              <button
                onClick={() => setEditingTractor(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Daily Rate ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingTractor.pricePerDay || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, pricePerDay: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hourly Rate ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingTractor.pricePerHour || 600}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, pricePerHour: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Acre Rate ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingTractor.pricePerAcre || 1200}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, pricePerAcre: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Horsepower (HP)
                  </label>
                  <input
                    type="number"
                    value={editingTractor.horsePower || 50}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, horsePower: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Location (District)
                  </label>
                  <input
                    type="text"
                    value={editingTractor.location || ""}
                    onChange={(e) =>
                      setEditingTractor({ ...editingTractor, location: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editingTractor.category || ""}
                  onChange={(e) =>
                    setEditingTractor({ ...editingTractor, category: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={editingTractor.description || ""}
                  onChange={(e) =>
                    setEditingTractor({ ...editingTractor, description: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingTractor(null)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Availability & Maintenance Calendar Modal */}
      {calendarTractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 text-gray-800 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {calendarTractor.brand} {calendarTractor.model} — Availability Calendar
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Click any date to block or unblock it for maintenance / private use</p>
              </div>
              <button
                onClick={() => setCalendarTractor(null)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Available for Booking
              </span>
              <span className="flex items-center gap-1.5 text-red-700">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Blocked (Maintenance / Farm Use)
              </span>
            </div>

            {/* Next 28 Days Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const dateObj = new Date();
                dateObj.setDate(dateObj.getDate() + i);
                const dateStr = dateObj.toISOString().split('T')[0];
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
                const isBlocked = (calendarTractor.blockedDates || []).includes(dateStr);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => toggleBlockDate(calendarTractor._id, dateStr)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between ${
                      isBlocked
                        ? 'bg-red-50 border-red-300 text-red-800 hover:bg-red-100'
                        : 'bg-emerald-50/60 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                    }`}
                  >
                    <span className="text-[10px] font-medium text-gray-500 uppercase">{dayName}</span>
                    <span className="text-base font-extrabold my-0.5">{dayNum}</span>
                    <span className="text-[10px] text-gray-400">{monthName}</span>
                    <span className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded-full ${
                      isBlocked ? 'bg-red-200 text-red-900' : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {isBlocked ? 'Blocked' : 'Open'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-5 border-t mt-5">
              <button
                type="button"
                onClick={() => setCalendarTractor(null)}
                className="px-5 py-2 bg-primary hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
