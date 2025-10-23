import React from "react";
import DataTable from "../components/shared/DataTable";

const Analytics: React.FC = () => {
  const analyticsData = [
    {
      id: 1,
      page: "/dashboard",
      views: 12456,
      uniqueVisitors: 8234,
      bounceRate: "32.5%",
      avgTime: "2:34",
      conversionRate: "4.2%",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      page: "/projects",
      views: 9876,
      uniqueVisitors: 6543,
      bounceRate: "28.1%",
      avgTime: "3:12",
      conversionRate: "6.1%",
      lastUpdated: "1 hour ago",
    },
    {
      id: 3,
      page: "/analytics",
      views: 7654,
      uniqueVisitors: 5432,
      bounceRate: "41.2%",
      avgTime: "1:56",
      conversionRate: "2.8%",
      lastUpdated: "30 minutes ago",
    },
    {
      id: 4,
      page: "/team",
      views: 5432,
      uniqueVisitors: 3456,
      bounceRate: "35.7%",
      avgTime: "2:18",
      conversionRate: "3.5%",
      lastUpdated: "45 minutes ago",
    },
    {
      id: 5,
      page: "/reports",
      views: 4321,
      uniqueVisitors: 2987,
      bounceRate: "29.8%",
      avgTime: "4:02",
      conversionRate: "7.3%",
      lastUpdated: "15 minutes ago",
    },
  ];

  const columns = [
    { key: "page", label: "Page" },
    {
      key: "views",
      label: "Page Views",
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: "uniqueVisitors",
      label: "Unique Visitors",
      render: (value: number) => value.toLocaleString(),
    },
    { key: "bounceRate", label: "Bounce Rate" },
    { key: "avgTime", label: "Avg. Time" },
    {
      key: "conversionRate",
      label: "Conversion Rate",
      render: (value: string) => (
        <span
          className={`font-medium ${
            parseFloat(value) > 5
              ? "text-green-600"
              : parseFloat(value) > 3
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "lastUpdated", label: "Last Updated" },
  ];

  const actions = [
    {
      label: "View Details",
      onClick: (row: any) => console.log("View details for:", row),
      variant: "primary" as const,
    },
    {
      label: "Export",
      onClick: (row: any) => console.log("Export data for:", row),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Traffic Overview
          </h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-600 font-medium">
                Traffic Analytics Chart
              </p>
              <p className="text-sm text-gray-500">
                Line chart showing traffic trends
              </p>
            </div>
          </div>
        </div>

        {/* User Behavior */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Behavior
          </h3>
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-gray-600 font-medium">Behavior Flow Chart</p>
              <p className="text-sm text-gray-500">
                User journey visualization
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conversion Funnel
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { stage: "Visitors", count: 10000, percentage: 100 },
            { stage: "Sign-ups", count: 2500, percentage: 25 },
            { stage: "Trials", count: 1250, percentage: 12.5 },
            { stage: "Customers", count: 450, percentage: 4.5 },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-2">
                <div className="text-2xl font-bold text-blue-700">
                  {item.count.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">{item.percentage}%</div>
              </div>
              <p className="text-sm font-medium text-gray-700">{item.stage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Page Analytics Table */}
      {/* <DataTable
        title="Page Analytics"
        // columns={columns}
        data={analyticsData}
        actions={actions}
        searchable={true}
        pagination={true}
      /> */}

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Top Referrers
          </h4>
          <div className="space-y-3">
            {[
              { source: "Google", visitors: 5432, percentage: 45.2 },
              { source: "Direct", visitors: 3210, percentage: 26.7 },
              { source: "Social Media", visitors: 2108, percentage: 17.5 },
              { source: "Email", visitors: 1298, percentage: 10.8 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.source}</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.visitors.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Device Types
          </h4>
          <div className="space-y-3">
            {[
              { device: "Desktop", percentage: 65.4 },
              { device: "Mobile", percentage: 28.7 },
              { device: "Tablet", percentage: 5.9 },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.device}</span>
                  <span className="font-medium text-gray-900">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Geographic Data
          </h4>
          <div className="space-y-3">
            {[
              { country: "United States", visitors: 4521 },
              { country: "United Kingdom", visitors: 2134 },
              { country: "Germany", visitors: 1876 },
              { country: "France", visitors: 1432 },
              { country: "Canada", visitors: 1098 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.country}</span>
                <span className="text-sm font-medium text-gray-900">
                  {item.visitors.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
