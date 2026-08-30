import { useState } from "react";
import Title from "../../Components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const upDistricts = [
  "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi",
];

const AddTractor = () => {

  const {axios, currency} = useAppContext();


  const [image, setImage] = useState(null);

  const [tractor, setTractor] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuelType: "",
    seatingCapacity: "",
    location: "",
    description: "",
  });

  const handleChange = (e) => {
    setTractor({
      ...tractor,
      [e.target.name]: e.target.value,
    });
  };

  const [isLoading, setIsLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a tractor image.");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("tractorData", JSON.stringify({
      ...tractor,
      year: Number(tractor.year),
      pricePerDay: Number(tractor.pricePerDay),
      seatingCapacity: Number(tractor.seatingCapacity),
    }));
    formData.append("image", image);

    try {
      const { data } = await axios.post("/api/owner/add-tractor", formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setTractor({ brand: "", model: "", year: "", pricePerDay: "", category: "", transmission: "", fuelType: "", seatingCapacity: "", location: "", description: "" });
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
        className="flex flex-col gap-5 mt-6 max-w-xl text-sm text-gray-600"
      >
        {/* Image Upload */}
        <div className="flex items-center gap-3">
          <label htmlFor="tractor-image">
            <img src={ image ? URL.createObjectURL(image) : assets.upload_icon } alt="Upload Tractor" className="h-16 w-16 rounded cursor-pointer object-cover"/>
          </label>

          <input id="tractor-image" type="file" accept="image/*" hidden onChange={(e) => {if (e.target.files.length > 0) {setImage(e.target.files[0]);}}}/>
            <p>Upload a tractor image</p>
        </div>

        {/* Brand & Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label>Brand</label>
            <input type="text" name="brand" value={tractor.brand} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none"required/>
          </div>

          <div>
            <label>Model</label>
            <input type="text" name="model" value={tractor.model} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required />
          </div>
        </div>

        {/* Year, Price, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label>Year</label>
            <input type="number" name="year" value={tractor.year} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required />
          </div>

          <div>
            <label>Daily Price ({currency})</label>
            <input type="number" name="pricePerDay" value={tractor.pricePerDay} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required />
          </div>

          <div>
            <label>Category</label>
            <select name="category" value={tractor.category} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required >
              <option value="">Select Category</option>
              <option>Mahindra</option>
              <option>Swaraj</option>
              <option>John Deere</option>
              <option>Massey Ferguson</option>
              <option>TAFE</option>
              <option>Sonalika</option>
              <option>New Holland</option>
              <option>Powertrac</option>
              <option>Farmtrac</option>
              <option>Eicher</option>
              <option>ACE</option>
              <option>Kubota</option>
              <option>Preet</option>
              <option>Deutz-Fahr</option>
              <option>VST</option>
              <option>Force</option>
              <option>Indo Farm</option>
              <option>Captain</option>
              <option>Solis</option>
              <option>Trakstar</option>
              <option>Same Deutz-Fahr</option>
            </select>
          </div>
        </div>

        {/* Transmission, Fuel Type, Seating */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label>Transmission</label>
            <select name="transmission" value={tractor.transmission} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required >
              <option value="">Select Transmission</option>
              <option>Automatic</option>
              <option>Manual</option>
              <option>Semi-Automatic</option>
            </select>
          </div>

          <div>
            <label>Fuel Type</label>
            <select name="fuelType" value={tractor.fuelType} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required >
              <option value="">Select Fuel Type</option>
              <option>Diesel</option>
              <option>Petrol</option>
              <option>CNG</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label>Seating Capacity</label>
            <input type="number" name="seatingCapacity" value={tractor.seatingCapacity} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required/>
          </div>
        </div>

        {/* Location */}
        <div>
          <label>Location</label>
          <select name="location" value={tractor.location} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" required >
            <option value="">Select Location</option>
            {upDistricts.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea name="description" rows="5" value={tractor.description} onChange={handleChange} className="w-full border border-borderColor rounded-md px-3 py-2 mt-1 outline-none" placeholder="Enter tractor description..." required/>
        </div>

        <button type="submit" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md w-fit">
          <img src={assets.tick_icon} alt="Tick" /> {isLoading ? 'Listing..' : 'List Your Tractor'} </button>
      </form>
    </div>
  );
};

export default AddTractor;
