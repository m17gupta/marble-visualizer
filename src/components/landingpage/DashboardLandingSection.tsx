
import React from "react";


export const DashboardLandingSection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex flex-col items-center">

      {/* Featured Marbles Section */}
      <section className="w-full max-w-5xl py-10 px-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Featured Marble Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example marble cards - replace with real data/images */}
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img src="/public/assets/image/marble1.jpg" alt="Marble 1" className="h-40 w-full object-cover rounded mb-4" />
            <h3 className="font-bold text-lg">Carrara White</h3>
            <p className="text-gray-500">Classic Italian marble, perfect for luxury interiors.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img src="/public/assets/image/marble2.jpg" alt="Marble 2" className="h-40 w-full object-cover rounded mb-4" />
            <h3 className="font-bold text-lg">Emperador Dark</h3>
            <p className="text-gray-500">Rich brown tones for elegant spaces.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img src="/public/assets/image/marble3.jpg" alt="Marble 3" className="h-40 w-full object-cover rounded mb-4" />
            <h3 className="font-bold text-lg">Statuario</h3>
            <p className="text-gray-500">Premium white marble with dramatic veining.</p>
          </div>
        </div>
      </section>

  

   
    </div>
  );
};

export default DashboardLandingSection;
