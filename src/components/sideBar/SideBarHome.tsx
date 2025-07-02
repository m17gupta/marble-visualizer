import React from 'react'
import { useSelector } from 'react-redux'
import { SideBar } from './SideBar';
import { RootState } from '@/redux/store';
import SideBarVisual from './SideBarVisual';

const SideBarHome = () => {
    const {isAuthenticated}= useSelector((state: RootState) => state.auth);
  return (
    <div>
      {isAuthenticated ? (
        <SideBar/>
      ) : (
        <SideBarVisual/>
      )}
    </div>
  )
}

export default SideBarHome