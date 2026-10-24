import { useCallback, useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import TractorCard from "../Components/TractorCard";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";
import { parseLocation, getDistricts, getBlocks } from "../data/indiaLocations";

const farmingOperations = [
  { id: "all", label: "All Operations", icon: "🌱" },
  { id: "ploughing", label: "Ploughing & Tillage", icon: "🚜", terms: ["plow", "plough", "tillage", "rotavator", "cultivator", "utility"] },
  { id: "harvesting", label: "Harvesting & Threshing", icon: "🌾", terms: ["harvest", "thresh", "heavy", "premium", "55"] },
  { id: "haulage", label: "Haulage & Transport", icon: "🚛", terms: ["haulage", "trolley", "transport", "commercial"] },
  { id: "puddling", label: "Puddling & Paddy Work", icon: "💧", terms: ["puddling", "paddy", "4wd", "compact", "orchard"] },
];

const brandsList = ["All", "Mahindra", "Swaraj", "John Deere", "Massey Ferguson", "Sonalika", "ACE"];
const hpList = ["All", "Under 40 HP", "40 - 55 HP", "55+ HP"];

const Tractors = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");
  const queryParam = searchParams.get("query") || "";

  const { tractors, axios, currency } = useAppContext();
  const { lang } = useLanguage();

  const isSearchData = Boolean(pickupLocation && pickupDate && returnDate);
  const [filteredTractors, setFilteredTractors] = useState([]);
  const [input, setInput] = useState(queryParam);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedHP, setSelectedHP] = useState("All");
  const [selectedOperation, setSelectedOperation] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);

  // Compute available districts from active tractors + UP master list
  const availableDistricts = useMemo(() => {
    const set = new Set();
    (tractors || []).forEach((t) => {
      const parsed = parseLocation(t.location || "");
      const d = t.district || parsed.district;
      if (d) set.add(d);
    });
    // Add primary UP hubs
    ["Varanasi", "Gorakhpur", "Prayagraj", "Mirzapur", "Sonbhadra", "Chandauli", "Jaunpur", "Ghazipur", "Azamgarh", "Lucknow", "Kanpur Nagar"].forEach(
      (d) => set.add(d)
    );
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [tractors]);

  // Compute available blocks when district is chosen
  const availableBlocks = useMemo(() => {
    if (selectedDistrict === "All") return ["All"];
    const baseBlocks = getBlocks("Uttar Pradesh", selectedDistrict);
    const set = new Set(baseBlocks);
    (tractors || []).forEach((t) => {
      const parsed = parseLocation(t.location || "");
      const d = t.district || parsed.district;
      const b = t.block || parsed.block;
      if (d && d.toLowerCase() === selectedDistrict.toLowerCase() && b) {
        set.add(b);
      }
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [selectedDistrict, tractors]);

  const searchTractorsAvailability = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/booking/check-availability", {
        location: pickupLocation,
        startDate: pickupDate,
        endDate: returnDate,
      });

      if (data.success) {
        setFilteredTractors(data.availableTractors);
        if (data.availableTractors.length === 0) {
          toast(lang === "hi" ? "कोई ट्रैक्टर उपलब्ध नहीं है" : "No tractors available for selected dates");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [axios, pickupLocation, pickupDate, returnDate, lang]);

  useEffect(() => {
    if (isSearchData) {
      searchTractorsAvailability();
    } else {
      setFilteredTractors(tractors ?? []);
    }
  }, [isSearchData, searchTractorsAvailability, tractors]);

  useEffect(() => {
    if (queryParam) {
      setInput(queryParam);
    }
  }, [queryParam]);

  // Comprehensive multi-factor filtering
  const displayedTractors = useMemo(() => {
    const searchTerm = input.trim().toLowerCase();

    return (filteredTractors ?? []).filter((tractor) => {
      // 1. Availability Filter
      if (onlyAvailable && tractor.isAvailable === false) return false;

      // 2. Max Price Filter
      const price = Number(tractor.pricePerDay || 1500);
      if (price > maxPrice) return false;

      // 3. Brand Filter
      const matchesBrand =
        selectedBrand === "All" || tractor.brand?.toLowerCase() === selectedBrand.toLowerCase();
      if (!matchesBrand) return false;

      // 4. HP Filter
      const hp = Number(tractor.horsePower || 50);
      if (selectedHP === "Under 40 HP" && hp >= 40) return false;
      if (selectedHP === "40 - 55 HP" && (hp < 40 || hp > 55)) return false;
      if (selectedHP === "55+ HP" && hp <= 55) return false;

      // 5. Farming Operation Filter
      if (selectedOperation !== "all") {
        const op = farmingOperations.find((o) => o.id === selectedOperation);
        if (op?.terms) {
          const combinedText = `${tractor.category || ""} ${tractor.description || ""} ${tractor.model || ""}`.toLowerCase();
          const matchesOp = op.terms.some((term) => combinedText.includes(term));
          if (!matchesOp) return false;
        }
      }

      // 6. District Filter
      if (selectedDistrict !== "All") {
        const parsed = parseLocation(tractor.location || "");
        const tractorDist = (tractor.district || parsed.district || "").toLowerCase();
        const rawLoc = (tractor.location || "").toLowerCase();
        const targetDist = selectedDistrict.toLowerCase();
        if (!tractorDist.includes(targetDist) && !rawLoc.includes(targetDist)) {
          return false;
        }
      }

      // 7. Block / Tehsil Filter
      if (selectedBlock !== "All") {
        const parsed = parseLocation(tractor.location || "");
        const tractorBlk = (tractor.block || parsed.block || "").toLowerCase();
        const rawLoc = (tractor.location || "").toLowerCase();
        const targetBlk = selectedBlock.toLowerCase();
        if (!tractorBlk.includes(targetBlk) && !rawLoc.includes(targetBlk)) {
          return false;
        }
      }

      // 8. Free text search
      if (!searchTerm) return true;

      const parsed = parseLocation(tractor.location || "");
      return [
        tractor.brand,
        tractor.model,
        tractor.category,
        tractor.transmission,
        tractor.fuelType,
        tractor.location,
        tractor.district || parsed.district,
        tractor.block || parsed.block,
        tractor.state || parsed.state,
      ].some((value) => value?.toLowerCase().includes(searchTerm));
    });
  }, [
    filteredTractors,
    onlyAvailable,
    maxPrice,
    selectedBrand,
    selectedHP,
    selectedOperation,
    selectedDistrict,
    selectedBlock,
    input,
  ]);

  return (
    <div className="pb-24">
      {/* Top Banner & Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-emerald-50/60 to-white pt-12 pb-8 border-b border-stone-200/80 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200 mb-2">
            {lang === "hi" ? "सत्यापित कृषि फ्लीट" : "Certified Machinery Fleet"}
          </span>
          <Title
            title={lang === "hi" ? "किराए के लिए उपलब्ध ट्रैक्टर" : "Available Tractors & Machinery"}
            subtitle={
              lang === "hi"
                ? "अपनी फसल और खेत के अनुसार सही क्षमता का ट्रैक्टर चुनें — दिन, घंटे या एकड़ अनुसार।"
                : "Browse reliable tractors equipped for plowing, haulage, and harvesting across your district."
            }
          />

          {/* Search Box */}
          <div className="relative mt-6 max-w-xl w-full">
            <div className="flex items-center bg-white border border-stone-200 rounded-2xl shadow-sm px-4 h-13 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/10 transition">
              <img src={assets.search} alt="Search" className="w-4 h-4 mr-2.5 opacity-60" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === "hi"
                    ? "ब्रांड, मॉडल या जिला खोजें (उदा: महिंद्रा, गोरखपुर)..."
                    : "Search by brand, model, horsepower, or district..."
                }
                className="w-full h-full outline-none text-slate-800 text-sm placeholder-stone-400 font-medium"
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="text-xs font-bold text-stone-400 hover:text-stone-700 px-2 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Farming Operations Chip Selector */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1 hidden sm:inline">
              {lang === "hi" ? "कार्य प्रकार:" : "Task:"}
            </span>
            {farmingOperations.map((op) => (
              <button
                key={op.id}
                onClick={() => setSelectedOperation(op.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedOperation === op.id
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                <span>{op.icon}</span>
                <span>{op.label}</span>
              </button>
            ))}
          </div>

          {/* Location Filter: District -> Block Pills */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 max-w-4xl">
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-2xl shadow-2xs">
              <span className="text-stone-400 font-semibold text-[11px] flex items-center gap-1">
                <span>📍</span> District:
              </span>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedBlock("All");
                }}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d === "All" ? "All Districts" : `${d} (UP)`}
                  </option>
                ))}
              </select>
            </div>

            {selectedDistrict !== "All" && availableBlocks.length > 1 && (
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-2xl shadow-2xs">
                <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                  <span>🌾</span> Block / Tehsil:
                </span>
                <select
                  value={selectedBlock}
                  onChange={(e) => setSelectedBlock(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-emerald-900 outline-none cursor-pointer"
                >
                  {availableBlocks.map((b) => (
                    <option key={b} value={b}>
                      {b === "All" ? `All Blocks in ${selectedDistrict}` : b}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedDistrict !== "All" || selectedBlock !== "All") && (
              <button
                onClick={() => {
                  setSelectedDistrict("All");
                  setSelectedBlock("All");
                }}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer px-1"
              >
                Reset Location
              </button>
            )}
          </div>

          {/* Secondary Filter Bar: Brand, HP, Availability & Max Price */}
          <div className="mt-5 p-3.5 sm:p-4 rounded-3xl bg-white border border-stone-200 max-w-4xl w-full shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4">
            {/* Brand Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-semibold text-[11px] mr-0.5">Brand:</span>
              {brandsList.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedBrand === brand
                      ? "bg-stone-900 text-white font-bold shadow-2xs"
                      : "text-stone-600 hover:bg-stone-100 bg-stone-50"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Controls Group: HP, Price, Availability */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
              {/* HP Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-400 font-medium text-[11px]">Power:</span>
                <select
                  value={selectedHP}
                  onChange={(e) => setSelectedHP(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-700 outline-none cursor-pointer"
                >
                  {hpList.map((hp) => (
                    <option key={hp} value={hp}>
                      ⚡ {hp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Slider */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium text-[11px]">Max:</span>
                <span className="font-bold text-emerald-800">{currency}{maxPrice}</span>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="accent-emerald-700 w-20 sm:w-24 cursor-pointer"
                />
              </div>

              {/* Availability Switch */}
              <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-500 h-4 w-4 accent-emerald-700 cursor-pointer"
                />
                <span className="text-[11px] sm:text-xs">{lang === "hi" ? "उपलब्ध" : "Available Only"}</span>
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Catalog Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-stone-600">
            {lang === "hi" ? "परिणाम:" : "Showing"} <span className="text-slate-900 font-extrabold">{displayedTractors.length}</span> {lang === "hi" ? "ट्रैक्टर उपलब्ध" : "Tractors"}
          </p>
          {(selectedBrand !== "All" || selectedHP !== "All" || selectedOperation !== "all" || onlyAvailable || input) && (
            <button
              onClick={() => {
                setSelectedBrand("All");
                setSelectedHP("All");
                setSelectedOperation("all");
                setOnlyAvailable(false);
                setInput("");
                setMaxPrice(3000);
              }}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              {lang === "hi" ? "सभी फ़िल्टर साफ़ करें" : "Reset all filters"}
            </button>
          )}
        </div>

        {displayedTractors.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <span className="text-4xl">🚜</span>
            <h3 className="mt-3 text-lg font-bold text-slate-800">
              {lang === "hi" ? "कोई मेल खाता ट्रैक्टर नहीं मिला" : "No tractors match your criteria"}
            </h3>
            <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
              {lang === "hi"
                ? "कृपया अपने फ़िल्टर समायोजित करें या दूसरा जिला / कार्य प्रकार चुनें।"
                : "Try expanding your price range, clearing horsepower filters, or searching in an adjacent district."}
            </p>
            <button
              onClick={() => {
                setSelectedBrand("All");
                setSelectedHP("All");
                setSelectedOperation("all");
                setOnlyAvailable(false);
                setInput("");
              }}
              className="mt-5 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition cursor-pointer"
            >
              {lang === "hi" ? "फ़िल्टर रीसेट करें" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedTractors.map((tractor) => (
              <motion.div
                key={tractor._id || tractor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <TractorCard tractor={tractor} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tractors;
