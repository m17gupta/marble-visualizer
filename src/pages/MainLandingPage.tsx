import React from "react";
import { DashboardLandingSection } from "@/components/landingpage/DashboardLandingSection";
import { ProfilePage } from "./ProfilePage";
// import { SideBar } from "@/components/sideBar/SideBar";


const MainLandingPage = () => {
  return (
    <>
      {/* <ProfilePage /> */}
      {/* <SideBar/> */}

      <div className="min-h-screen bg-gray-50">
        <DashboardLandingSection />
      </div>
    </>
  );
};

export default MainLandingPage;
