import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import CarCards from "../Components/CarCards";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {motion} from 'motion/react'

const Tractors = () => {

  // getting search params from url
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const { tractors, axios } = useAppContext();

  const isSearchData = Boolean(pickupLocation && pickupDate && returnDate);
  const [filteredTractors, setFilteredTractors] = useState([]);

  const searchTractorsAvailability = useCallback(async () => {
    try {
      const { data } = await axios.post('/api/booking/check-availability', {
        location: pickupLocation,
        startDate: pickupDate,
        endDate: returnDate,
      });

      if (data.success) {
        setFilteredTractors(data.availableTractors);
        if (data.availableTractors.length === 0) {
          toast("No tractors available");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [axios, pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (isSearchData) {
      searchTractorsAvailability();
    } else {
        setFilteredTractors(tractors ?? []);
    }
  }, [isSearchData, searchTractorsAvailability, tractors]);

  const queryParam = searchParams.get('query') || '';
  const [input, setInput] = useState(queryParam);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedHP, setSelectedHP] = useState('All');

  useEffect(() => {
    if (queryParam) {
      setInput(queryParam);
    }
  }, [queryParam]);

  const searchTerm = input.trim().toLowerCase();
  const displayedTractors = (filteredTractors ?? []).filter((tractor) => {
    const matchesBrand = selectedBrand === 'All' || tractor.brand?.toLowerCase() === selectedBrand.toLowerCase();
    if (!matchesBrand) return false;

    // HP Filter
    const hp = Number(tractor.horsePower || 50);
    if (selectedHP === 'Under 40 HP' && hp >= 40) return false;
    if (selectedHP === '40 - 55 HP' && (hp < 40 || hp > 55)) return false;
    if (selectedHP === '55+ HP' && hp <= 55) return false;

    if (!searchTerm) return true;

    return [
      tractor.brand,
      tractor.model,
      tractor.category,
      tractor.transmission,
      tractor.fuelType,
      tractor.location,
    ].some((value) => value?.toLowerCase().includes(searchTerm));
  });

  return (
    <div>
      <motion.div 
      initial={{opacity: 0, y:30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      className="flex flex-col items-center py-16 bg-light max-md:px-4">
        <Title title="Available Tractors" subtitle="Browse our selection of reliable tractors for your next job."/>

        <motion.div 
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.3}}
        className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search} alt="Search" className="w-4 h-4 mr-2"/>

          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search by make, model, location..." className="w-full h-full outline-none text-gray-500 text-sm"/>
          {input && (
            <button onClick={() => setInput("")} className="text-xs text-gray-400 hover:text-gray-600 mr-2">Clear</button>
          )}
          <img src={assets.Filter} alt="Filter" className="w-4 h-4 ml-1 opacity-70"/>
        </motion.div>

        {/* Brand Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5 max-w-3xl">
          {["All", "Mahindra", "Swaraj", "John Deere", "Massey Ferguson", "Sonalika", "ACE"].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedBrand === brand
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Horsepower Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 max-w-xl text-xs">
          <span className="text-gray-400 font-medium text-[11px] mr-1">Power (HP):</span>
          {["All", "Under 40 HP", "40 - 55 HP", "55+ HP"].map((hpOption) => (
            <button
              key={hpOption}
              onClick={() => setSelectedHP(hpOption)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedHP === hpOption
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              ⚡ {hpOption}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div 
      initial={{opacity: 0, y:30}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, delay: 0.5}}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
      <p className="text-gray-500 xl:px-24 max-w-7xl mx-auto">Showing {displayedTractors.length} Tractors</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl  mx-auto">
      {displayedTractors.map((tractor) => (
        <motion.div 
        initial={{opacity: 0, y:30}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.5}}
        key={tractor._id || tractor.id}>
          <CarCards tractor={tractor} />
        </motion.div>
        ))}
        </div>
      </motion.div>

    </div>
  );
};

export default Tractors; 
