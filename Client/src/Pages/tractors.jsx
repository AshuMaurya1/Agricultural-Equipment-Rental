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
      toast.error(error.message);
    }
  }, [axios, pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (isSearchData) {
      searchTractorsAvailability();
    } else {
        setFilteredTractors(tractors ?? []);
    }
  }, [isSearchData, searchTractorsAvailability, tractors]);

  const [input, setInput] = useState("");
  const searchTerm = input.trim().toLowerCase();
  const displayedTractors = (filteredTractors ?? []).filter((tractor) => {
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
      className="flex flex-col items-center py-20 bg-light max-md:px-4">
        <Title title="Available Tractors" subtitle="Browse our selection of reliable tractors for your next job."/>

        <motion.div 
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.3}}
        className="flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">
          <img src={assets.search} alt="Search" className="w-4 h-4 mr-2"/>

          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Search by make, model, or features" className="w-full h-full outline-none text-gray-500"/>
          <img src={assets.Filter} alt="Filter" className="w-4 h-4 ml-2"/>
        </motion.div>
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
