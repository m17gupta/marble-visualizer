
import React from "react";
import { BreadcrumbWithDropdown } from "../BreadcrumbWithDropdown";
import DashboardShowcase from "./DashboardShowcase";
import ProdcutCardSection from "./ProdcutCardSection";
import RenovationKit from "./RenovationKit";


export const DashboardLandingSection = () => {
  return (
    <>
       

    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex flex-col items-center">
      {/* Featured Marbles Section */}
    

        <div className="border-b border-gray-200 bg-white shadow-sm w-full px-6 py-4" >
           <BreadcrumbWithDropdown/>
       </div>


      <section className="w-full  py-10 px-8">
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
             Welcome Vijendra
        </h2>

       <DashboardShowcase/>
       <ProdcutCardSection />
        <RenovationKit/>
       
       
      </section>
    </div>
    </>
  );
};

export default DashboardLandingSection;
