import React from 'react'
import { useSelector } from 'react-redux'
import { SideBar } from './SideBar';
import { RootState } from '@/redux/store';
import SideBarVisual from './SideBarVisual';


const SideBarHome = ({ sidebarCollapsed, setSidebarCollapsed }: { sidebarCollapsed: boolean, setSidebarCollapsed: (v: boolean) => void }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return (
    <div>
      {isAuthenticated ? (
        <SideBar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      ) : (
        <SideBarVisual sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      )}
    </div>
  );
}

export default SideBarHome