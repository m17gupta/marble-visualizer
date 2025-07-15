import React from "react";
import { DashboardLandingSection } from "@/components/DashboardLandingSection";
import Breadcrumb from "@/components/breadcrumbs/Breadcrumb";
import { ProfilePage } from "./ProfilePage";

const MainLandingPage = () => {
  return (
    <>
      {/* <ProfilePage /> */}

      <div className="min-h-screen bg-gray-50 border-2 border-black">
        <DashboardLandingSection />
      </div>
    </>
  );
};

export default MainLandingPage;
