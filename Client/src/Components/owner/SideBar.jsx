import { useState, useEffect } from "react"
import { assets, OwnerMenuLinks } from "../../assets/assets"
import { NavLink, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const SideBar = () => {
    const {user, axios, fetchUser} = useAppContext();
    const location = useLocation();
    const [profileImage, setProfileImage] = useState(user?.image)
    const [image, setImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    useEffect(() => {
        // update profileImage when user data becomes available/changes
        setProfileImage(user?.image)
    }, [user])

    useEffect(() => {
        // create preview URL for selected File
        if (!image) {
            setPreviewUrl(null)
            return
        }

        const url = URL.createObjectURL(image)
        setPreviewUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [image])

    const updateImage = async() => {
        try{
            if (!image) return toast.error('No image selected')

            const formData = new FormData();
            formData.append('image', image)

            const {data} = await axios.post('/api/owner/update-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if(data.success){
                fetchUser()
                toast.success(data.message)
                // update profileImage from returned user if available
                setProfileImage(data.user?.image || profileImage)
                setImage(null)
            }else{
                toast.error(data.message || 'Failed to update image')
            }
        } catch(error){
            toast.error(error.message)
        }
    }

  return (
    <div className="relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm">
        <div className="group relative">
            <label htmlFor="image">
                <img src={previewUrl || profileImage || assets.user} alt={user?.name || "Owner"} className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"/>
                <input type="file" id="image" accept="image/*" hidden onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) setImage(file)
                }}/>

                <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs">Edit</span>
                </div>
            </label>
        </div>
        {image && (
            <button onClick={updateImage} className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer">Save <img src={assets.Check} alt="check" width={13}/></button>
        )}
        <p className="mt-2 text-base max-md:hidden">{user?.name}</p>

        <div className="w-full">
            {OwnerMenuLinks.map((link, index) => (
               <NavLink key={index} to={link.path} className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary ' : 'text-gray-600'}`}>
                <img src={link.path === location.pathname ? link.ColorIcon : link.Logo} alt=" tractor Icon" />
                <span className="max-md:hidden">{link.name}</span>
                <div className={`${link.path === location.pathname && 'bg-primary'} w-1.5 h-8 rounded-1 right-0 absolute`}></div>
               </NavLink>
            ))}
        </div>
        
    </div>
  )
}

export default SideBar
