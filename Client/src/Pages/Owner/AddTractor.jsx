import { useState } from "react";
import Title from "../../Components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const upDistricts = [
  "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi",
];

const tractorCategories = [
  "Compact Tractor (Under 35 HP)",
  "Utility Tractor (35-55 HP)",
  "Heavy Duty Tractor (55+ HP)",
  "4WD Heavy Farm Tractor",
  "Orchard / Mini Tractor",
  "Plow & Tillage Specialized",
  "Commercial Haulage Tractor",
];

const AddTractor = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);

  const [tractor, setTractor] = useState({
    brand: "",
    model: "",
    year: "",
    horsePower: "50",
    pricePerDay: "",
    pricePerHour: "600",
    pricePerAcre: "1200",
    transportRatePerKm: "40",
    category: "",
    transmission: "Manual",
    fuelType: "Diesel",
    seatingCapacity: "1",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setTractor({
      ...tractor,
      [e.target.name]: e.target.value,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a tractor image.");
      return;
    }

    if (Number(tractor.pricePerDay) <= 0) {
      toast.error("Please enter a valid daily rental price.");
      return;
    }
    const currentYear = new Date().getFullYear();
    if (Number(tractor.year) < 1980 || Number(tractor.year) > currentYear + 1) {
      toast.error(`Please enter a valid manufacturing year between 1980 and ${currentYear + 1}.`);
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append(
      "tractorData",
      JSON.stringify({
        ...tractor,
        year: Number(tractor.year),
        horsePower: Number(tractor.horsePower) || 50,
        pricePerDay: Number(tractor.pricePerDay),
        pricePerHour: Number(tractor.pricePerHour) || 600,
        pricePerAcre: Number(tractor.pricePerAcre) || 1200,
        transportRatePerKm: Number(tractor.transportRatePerKm) || 40,
        seatingCapacity: Number(tractor.seatingCapacity) || 1,
      })
    );
    formData.append("image", image);

    try {
      const { data } = await axios.post("/api/owner/add-tractor", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setTractor({
          brand: "",
          model: "",
          year: "",
          horsePower: "50",
          pricePerDay: "",
          pricePerHour: "600",
          pricePerAcre: "1200",
          transportRatePerKm: "40",
          category: "",
          transmission: "Manual",
          fuelType: "Diesel",
          seatingCapacity: "1",
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-4 py-10 flex-1">
      <Title
        title="Add New Tractor"
        subtitle="Fill in the details to list a new tractor for booking."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 mt-6 max-w-xl text-sm text-gray-600 bg-white p-6 rounded-xl border border-borderColor shadow-xs"
      >
        {/* Image Upload */}
        <div className="flex items-center gap-4">
          <label htmlFor="tractor-image" className="cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt="Upload Tractor"
              className="h-20 w-20 rounded-lg object-cover border border-dashed border-gray-300 p-1 bg-gray-50 hover:bg-gray-100 transition"
            />
          </label>

          <input
            id="tractor-image"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
            }}
          />
          <div>
            <p className="font-medium text-gray-700">Tractor Image</p>
            <p className="text-xs text-gray-400 mt-0.5">Click icon to choose high quality machine photo</p>
          </div>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="font-medium text-gray-700">Brand (e.g. Mahindra, Swaraj)</label>
            <input
              type="text"
              name="brand"
              value={tractor.brand}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="e.g. Mahindra"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={tractor.model}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="e.g. 575 DI"
              required
            />
          </div>
        </div>

        {/* Year, Category, Horsepower */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="font-medium text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={tractor.year}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="2023"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={tractor.category}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary bg-white"
              required
            >
              <option value="">Select Category</option>
              {tractorCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Engine Power (HP)</label>
            <input
              type="number"
              name="horsePower"
              value={tractor.horsePower}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="50"
              required
            />
          </div>
        </div>

        {/* Multi-Unit Pricing (Day, Hour, Acre) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
          <div>
            <label className="font-medium text-gray-700">Daily Rate ({currency})</label>
            <input
              type="number"
              name="pricePerDay"
              value={tractor.pricePerDay}
              onChange={handleChange}
              className="w-full bg-white border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="1500"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Hourly Rate ({currency})</label>
            <input
              type="number"
              name="pricePerHour"
              value={tractor.pricePerHour}
              onChange={handleChange}
              className="w-full bg-white border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="600"
              required
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Acre Tillage Rate ({currency})</label>
            <input
              type="number"
              name="pricePerAcre"
              value={tractor.pricePerAcre}
              onChange={handleChange}
              className="w-full bg-white border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              placeholder="1200"
              required
            />
          </div>
        </div>

        {/* Transmission, Fuel Type, Seating */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="font-medium text-gray-700">Transmission</label>
            <select
              name="transmission"
              value={tractor.transmission}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary bg-white"
              required
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="Constant Mesh">Constant Mesh</option>
              <option value="Synchromesh">Synchromesh</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Fuel Type</label>
            <select
              name="fuelType"
              value={tractor.fuelType}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary bg-white"
              required
            >
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Operator Seats</label>
            <input
              type="number"
              name="seatingCapacity"
              value={tractor.seatingCapacity}
              onChange={handleChange}
              className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="font-medium text-gray-700">Location (District in UP)</label>
          <select
            name="location"
            value={tractor.location}
            onChange={handleChange}
            className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary bg-white"
            required
          >
            <option value="">Select Location</option>
            {upDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="4"
            value={tractor.description}
            onChange={handleChange}
            className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none focus:border-primary"
            placeholder="Specify tractor horsepower, PTO specs, implements included or supported (e.g., Rotavator, Cultivator), and availability hours..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary hover:bg-blue-700 transition text-white px-6 py-2.5 rounded-lg w-fit cursor-pointer font-medium disabled:opacity-50"
        >
          <img src={assets.tick_icon} alt="Tick" className="w-4 h-4" />
          {isLoading ? "Listing..." : "List Your Tractor"}
        </button>
      </form>
    </div>
  );
};

export default AddTractor;
