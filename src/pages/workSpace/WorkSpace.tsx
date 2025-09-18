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
        <motion.aside
          initial={false}
          animate={{ width: sidebarCollapsed ? 80 : 280 }}
          className="fixed inset-y-0 left-0 z-50 hidden lg:block bg-card border-r border-border "
        >
    <SidebarContent
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            mobile={false}
            setMobileMenuOpen={setMobileMenuOpen}
            setShareModalOpen={setShareModalOpen}
          />
          </motion.aside>


  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardLandingSection  />
          </motion.div>
         
    </>
    
  )
}

export default WorkSpace