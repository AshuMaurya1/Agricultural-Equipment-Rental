import { useCallback, useEffect, useState } from "react"; 
import Title from "../../Components/owner/Title"; 
import { assets } from "../../assets/assets"; 
import { useAppContext } from "../../context/AppContext"; 
import { toast } from "react-hot-toast"; 
 
const ManageTractors = () => { 
 
  const {isOwner, axios, currency} = useAppContext(); 
 
  const [tractors, setTractors] = useState([]); 
 
  const fetchOwnerTractors = useCallback(async () =>{ 
    try{ 
      const {data} = await axios.get('/api/owner/tractors') 
      if(data.success){ 
        setTractors(data.tractors) 
      } else { 
        toast.error(data.message) 
      } 
    }catch(error){ 
        toast.error(error.message) 
    } 
  }, [axios]) 
 
  useEffect(() => { 
    isOwner && fetchOwnerTractors() 
  }, [isOwner, fetchOwnerTractors]) 
 
 
  // Toggle availability 
  const toggleAvailability = async (tractorId) =>{ 
    try{ 
      const {data} = await axios.put(`/api/owner/tractors/${tractorId}/availability`) 
      if(data.success){ 
        toast.success(data.message)
        fetchOwnerTractors()
      } else { 
        toast.error(data.message) 
      } 
    }catch(error){ 
        toast.error(error.message) 
    } 
  } 
 
  // Delete tractor 
  const deleteTractor = async (tractorId) =>{ 
    try{ 
      const shouldDelete = window.confirm('Are you sure you want to delete this tractor?')

      if(!shouldDelete) return

      const {data} = await axios.delete(`/api/owner/tractors/${tractorId}`) 
      if(data.success){ 
        toast.success(data.message)
        fetchOwnerTractors()
      } else { 
        toast.error(data.message) 
      } 
    }catch(error){ 
        toast.error(error.message) 
    } 
  } 
 
  return ( 
    <div className="mx-4 py-10 w-full"> 
      <Title 
        title="Manage Tractors" 
        subtitle="View all listed tractors, upload their details, or remove them from the booking platform" 
      /> 
 
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6"> 
        <table className="w-full border-collapse text-left text-sm text-gray-600"> 
          <thead className="text-gray-500"> 
            <tr> 
              <th className="p-3 font-medium">Tractor</th> 
              <th className="p-3 font-medium max-md:hidden">Category</th> 
              <th className="p-3 font-medium">Price</th> 
              <th className="p-3 font-medium max-md:hidden">Status</th> 
              <th className="p-3 font-medium">Actions</th> 
            </tr> 
          </thead> 
 
          <tbody> 
            {tractors.map((tractor, index) => ( 
              <tr 
                key={tractor._id || index} 
                className="border-t border-borderColor" 
              > 
                <td className="p-3 flex items-center gap-3"> 
                  <img 
                    src={tractor.image} 
                    alt={`${tractor.brand} ${tractor.model}`} 
                    className="h-12 w-12 rounded-md object-cover" 
                  /> 
 
                  <div className="max-md:hidden"> 
                    <p className="font-medium"> 
                      {tractor.brand} {tractor.model} 
                    </p> 
                    <p className="text-xs text-gray-500"> 
                      {tractor.seatingCapacity} • {tractor.transmission} 
                    </p> 
                  </div> 
                </td> 
 
                <td className="p-3 max-md:hidden"> 
                  {tractor.category} 
                </td> 
 
                <td className="p-3"> 
                  {currency} 
                  {tractor.pricePerDay}/day 
                </td> 
 
                <td className="p-3 max-md:hidden"> 
                  <span 
                    className={`px-3 py-1 rounded-full text-xs ${ 
                      tractor.isAvailable 
                        ? "bg-green-100 text-green-600" 
                        : "bg-red-100 text-red-600" 
                    }`} 
                  > 
                    {tractor.isAvailable ? "Available" : "Unavailable"} 
                  </span> 
                </td> 
 
                <td className="p-3 flex items-center gap-3"> 
                  <img src={ tractor.isAvailable ? assets.Eye_close_icon : assets.Eye_icon } alt="Toggle Availability" className="w-5 h-5 cursor-pointer" onClick={() => toggleAvailability(tractor._id)} /> 
 
                  <img src={assets.Delete_icon} alt="Delete" className="w-5 h-5 cursor-pointer" onClick={() => deleteTractor(tractor._id)} /> 
                </td> 
              </tr> 
            ))} 
          </tbody> 
        </table> 
      </div> 
    </div> 
  ); 
}; 
 
export default ManageTractors;
