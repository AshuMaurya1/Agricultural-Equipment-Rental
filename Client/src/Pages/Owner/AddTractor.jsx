import { useState, useMemo } from "react";
import Title from "../../Components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  getStates,
  getDistricts,
  getBlocks,
  formatLocation,
} from "../../data/indiaLocations";

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

  // Granular Location States
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [customBlock, setCustomBlock] = useState("");
  const [villageOrLandmark, setVillageOrLandmark] = useState("");

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
    description: "",
  });

  const availableStates = useMemo(() => getStates(), []);
  const availableDistricts = useMemo(() => getDistricts(selectedState), [selectedState]);
  const availableBlocks = useMemo(
    () => getBlocks(selectedState, selectedDistrict),
    [selectedState, selectedDistrict]
  );

  const effectiveBlock = selectedBlock === "__custom__" ? customBlock.trim() : selectedBlock.trim();

  // Formatted location summary string
  const currentLocationPreview = useMemo(() => {
    return formatLocation({
      village: villageOrLandmark,
      block: effectiveBlock,
      district: selectedDistrict,
      state: selectedState,
    });
  }, [villageOrLandmark, effectiveBlock, selectedDistrict, selectedState]);

  const handleChange = (e) => {
    setTractor({
      ...tractor,
      [e.target.name]: e.target.value,
    });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setSelectedDistrict("");
    setSelectedBlock("");
    setCustomBlock("");
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    setSelectedBlock("");
    setCustomBlock("");
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

    if (!selectedState) {
      toast.error("Please select a State.");
      return;
    }
    if (!selectedDistrict) {
      toast.error("Please select a District.");
      return;
    }
    if (!effectiveBlock) {
      toast.error("Please select or enter your Block / Tehsil.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const fullLocationString = formatLocation({
      village: villageOrLandmark,
      block: effectiveBlock,
      district: selectedDistrict,
      state: selectedState,
    });

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
        state: selectedState,
        district: selectedDistrict,
        block: effectiveBlock,
        villageOrLandmark: villageOrLandmark.trim(),
        location: fullLocationString,
      })
    );
    formData.append("image", image);

    try {
      const { data } = await axios.post("/api/owner/add-tractor", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setSelectedDistrict("");
        setSelectedBlock("");
        setCustomBlock("");
        setVillageOrLandmark("");
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
    <div className="px-3 sm:px-6 md:px-8 py-6 sm:py-8 flex-1 max-w-4xl mx-auto">
      <Title
        title="Add New Tractor"
        subtitle="Fill in the details to list a new tractor for booking."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 mt-6 max-w-2xl text-sm text-stone-600 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs"
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

        {/* State -> District -> Block Location Hierarchy */}
        <div className="bg-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-emerald-100 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label className="font-bold text-gray-800 flex items-center gap-1.5 text-sm">
                <span>📍</span> Machinery Base Location (State &rarr; District &rarr; Block)
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Exact block/tehsil helps farmers within 15-30 km find your tractor with low delivery costs.
              </p>
            </div>
            {selectedDistrict && effectiveBlock && (
              <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 truncate max-w-xs">
                📍 {effectiveBlock}, {selectedDistrict}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* 1. State */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="w-full border border-borderColor rounded-md px-3 py-2 outline-none focus:border-primary bg-white text-xs sm:text-sm font-medium"
                required
              >
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. District */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">District *</label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                className="w-full border border-borderColor rounded-md px-3 py-2 outline-none focus:border-primary bg-white text-xs sm:text-sm font-medium"
                required
              >
                <option value="">Select District</option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Block / Tehsil */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Block / Tehsil *</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                disabled={!selectedDistrict}
                className="w-full border border-borderColor rounded-md px-3 py-2 outline-none focus:border-primary bg-white text-xs sm:text-sm font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {selectedDistrict ? "Select Block / Tehsil" : "Choose district first"}
                </option>
                {availableBlocks.map((blk) => (
                  <option key={blk} value={blk}>
                    {blk}
                  </option>
                ))}
                <option value="__custom__">➕ Other / Enter Custom Block</option>
              </select>
            </div>
          </div>

          {/* Custom Block Input when selectedBlock is '__custom__' */}
          {selectedBlock === "__custom__" && (
            <div className="mt-1">
              <label className="block text-xs font-semibold text-emerald-800 mb-1">
                Enter Custom Block / Tehsil Name *
              </label>
              <input
                type="text"
                value={customBlock}
                onChange={(e) => setCustomBlock(e.target.value)}
                placeholder="e.g. Pindra, Kasimabad, or your Tehsil"
                className="w-full border border-emerald-300 rounded-md px-3 py-2 outline-none focus:border-primary bg-white text-xs sm:text-sm"
                required
              />
            </div>
          )}

          {/* Optional Village / Landmark / Formatted Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1 border-t border-emerald-100/70">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Village / Landmark / Farm Base (Optional)
              </label>
              <input
                type="text"
                value={villageOrLandmark}
                onChange={(e) => setVillageOrLandmark(e.target.value)}
                placeholder="e.g. Near Phoolpur Bazar, Village Babatpur"
                className="w-full border border-borderColor rounded-md px-3 py-2 outline-none focus:border-primary bg-white text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Formatted Platform Location
              </label>
              <div className="w-full bg-white/80 border border-stone-200 rounded-md px-3 py-2 text-xs text-stone-700 font-semibold truncate flex items-center gap-1.5 h-[38px]">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="truncate">{currentLocationPreview || "Select location above"}</span>
              </div>
            </div>
          </div>
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
