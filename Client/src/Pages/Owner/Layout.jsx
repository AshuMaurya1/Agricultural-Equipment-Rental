import { useEffect } from 'react'
import NavbarOwner from '../../Components/owner/NavbarOwner'
import SideBar from '../../Components/owner/SideBar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
// import React from 'react'

const Layout = () => {
  const {isOwner, navigate} = useAppContext();

  useEffect (() => {
    if(!isOwner){
      navigate('/')
    }
  }, [isOwner, navigate])
  return (
    <div className='flex flex-col'>
      <NavbarOwner/>
      <div className='flex'>
        <SideBar />
        <Outlet/>
      </div>
        
    </div>
  )
}

export default Layout
