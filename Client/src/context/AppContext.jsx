import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) =>{

    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY;

    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [isOwner, setIsOwner] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [pickupDate, setPickupDate] = useState('')
    const [returnDate, setReturnDate] = useState('')

    const [tractors, setTractors] = useState([])

    //Function to Check is user is Logged in 
    const fetchUser = useCallback(async () => {
        try{
            const {data} = await axios.get('/api/user/data')
            if(data.success){
                setUser(data.user)
                setIsOwner(data.user.role === 'owner')
            } else {
                navigate('/')
            }
        }catch(error){
            if (error.response?.status === 401) {
                // The token saved in this browser is expired or no longer valid.
                // Clear it so the app does not repeatedly call protected routes.
                localStorage.removeItem('token')
                setToken(null)
                setUser(null)
                setIsOwner(false)
                delete axios.defaults.headers.common['Authorization']
                toast.error('Your session has expired. Please log in again.')
                return
            }

            toast.error(error.response?.data?.message || error.message)
        }
    }, [navigate])
    // FUnction to fetch all cars from the server

    const fetchTractors = useCallback(async () => {
        try {
            const {data} = await axios.get('/api/user/tractors')
            data.success ? setTractors(data.tractors) : toast.error(data.message)
        } catch (error){
            toast.error(error.message)
        }
    }, [])

    // Function to Log out the User
    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        setIsOwner(false)
        delete axios.defaults.headers.common['Authorization']
        toast.success('You have Been Logged out')
    }


    // useEffect to retrieve the token from localStorage
    useEffect(()=>{
        const token = localStorage.getItem('token')
        setToken(token)
        fetchTractors()
    }, [fetchTractors])

    // useEffect to fetch user data when token is Available
    useEffect(() => {
        if(token){
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchUser()
        }
    }, [token, fetchUser])

    const value = {
        navigate,
        currency,
        axios,
        user,
        setUser,
        token,
        setToken,
        isOwner,
        setIsOwner,
        fetchUser,
        showLogin,
        setShowLogin,
        logout,
        fetchTractors,
        tractors,
        setTractors,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate
    }

    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}
