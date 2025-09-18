import DashboardLandingSection from '@/components/landingpage/DashboardLandingSection'
import SidebarContent from '@/components/sideBar/SideBarContent'
import React, { useState } from 'react'
import { motion } from "framer-motion";
const WorkSpace = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [shareModalOpen, setShareModalOpen] = useState(false);
  return (
    <>
      

            <DashboardLandingSection  />
       
         
    </>
    
  )
}

export default WorkSpace