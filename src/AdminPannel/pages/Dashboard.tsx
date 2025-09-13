import React from 'react';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import ChartSection from '../components/dashboard/ChartSection';
import AdditionalTable from '../components/dashboard/AdditionalTable';
import GetAllUSerProfile from '../components/userProfile/GetAllUSerProfile';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Metrics Grid */}
        <MetricsGrid/>

      {/* Charts Section */}
      <ChartSection/>

      {/* Additional Tables Section */}
       <AdditionalTable/>

       <GetAllUSerProfile/>
    </div>
  );
};

export default Dashboard;