import React from "react";
import DataTable from "../components/shared/DataTable";

const DataLibrary: React.FC = () => {
  const libraryData = [
    {
      id: 1,
      name: "Customer Database",
      type: "Database",
      size: "2.3 GB",
      records: 125000,
      lastUpdated: "2 hours ago",
      source: "CRM System",
      format: "PostgreSQL",
      status: "Active",
    },
    {
      id: 2,
      name: "Product Catalog",
      type: "Dataset",
      size: "890 MB",
      records: 45000,
      lastUpdated: "1 day ago",
      source: "E-commerce API",
      format: "JSON",
      status: "Active",
    },
    {
      id: 3,
      name: "Analytics Reports",
      type: "Reports",
      size: "156 MB",
      records: 5000,
      lastUpdated: "30 minutes ago",
      source: "Analytics Engine",
      format: "CSV",
      status: "Processing",
    },
    {
      id: 4,
      name: "User Behavior Logs",
      type: "Logs",
      size: "5.7 GB",
      records: 2500000,
      lastUpdated: "5 minutes ago",
      source: "Application Logs",
      format: "Log Files",
      status: "Active",
    },
    {
      id: 5,
      name: "Financial Data",
      type: "Dataset",
      size: "432 MB",
      records: 78000,
      lastUpdated: "3 hours ago",
      source: "Accounting System",
      format: "Excel",
      status: "Archived",
    },
  ];

  const columns = [
    {
      key: "name",
      label: "Data Source",
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{row.source}</p>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Database"
              ? "bg-blue-100 text-blue-800"
              : value === "Dataset"
              ? "bg-green-100 text-green-800"
              : value === "Reports"
              ? "bg-purple-100 text-purple-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "format", label: "Format" },
    {
      key: "records",
      label: "Records",
      render: (value: number) => value.toLocaleString(),
    },
    { key: "size", label: "Size" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : value === "Processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
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
      label: "View Data",
      onClick: (row: any) => console.log("View data:", row),
      variant: "primary" as const,
    },
    {
      label: "Download",
      onClick: (row: any) => console.log("Download:", row),
      variant: "secondary" as const,
    },
    {
      label: "Archive",
      onClick: (row: any) => console.log("Archive:", row),
      variant: "danger" as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Data Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Data Sources
              </p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="text-2xl">📚</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Storage</p>
              <p className="text-3xl font-bold text-blue-600">12.7 GB</p>
            </div>
            <div className="text-2xl">💾</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Sources
              </p>
              <p className="text-3xl font-bold text-green-600">18</p>
            </div>
            <div className="text-2xl">🟢</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Data Quality</p>
              <p className="text-3xl font-bold text-blue-600">94%</p>
            </div>
            <div className="text-2xl">✨</div>
          </div>
        </div>
      </div>

      {/* Data Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Storage Usage by Type
          </h3>
          <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-gray-600 font-medium">
                Storage Distribution Chart
              </p>
              <p className="text-sm text-gray-500">
                Pie chart showing storage by data type
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Data Growth Trend
          </h3>
          <div className="h-48 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-gray-600 font-medium">Growth Analytics</p>
              <p className="text-sm text-gray-500">
                Data volume growth over time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources Table */}
      {/* <DataTable
        title="Data Sources"
        // columns={columns}
        data={libraryData}
        actions={actions}
        searchable={true}
        pagination={true}
      /> */}

      {/* Data Quality & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Data Quality Score
          </h4>
          <div className="space-y-4">
            {[
              { source: "Customer Database", score: 98 },
              { source: "Product Catalog", score: 94 },
              { source: "Analytics Reports", score: 89 },
              { source: "User Behavior Logs", score: 96 },
              { source: "Financial Data", score: 92 },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.source}</span>
                  <span className="font-medium text-gray-900">
                    {item.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.score >= 95
                        ? "bg-green-500"
                        : item.score >= 90
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Recent Updates
          </h4>
          <div className="space-y-4">
            {[
              {
                action: "Data imported",
                source: "Customer Database",
                time: "2 hours ago",
              },
              {
                action: "Schema updated",
                source: "Product Catalog",
                time: "1 day ago",
              },
              {
                action: "Report generated",
                source: "Analytics Reports",
                time: "30 minutes ago",
              },
              {
                action: "Backup completed",
                source: "Financial Data",
                time: "3 hours ago",
              },
            ].map((update, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {update.action}
                  </p>
                  <p className="text-xs text-gray-500">
                    {update.source} • {update.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            Data Connections
          </h4>
          <div className="space-y-4">
            {[
              { service: "PostgreSQL", status: "Connected", count: 3 },
              { service: "MongoDB", status: "Connected", count: 2 },
              { service: "AWS S3", status: "Connected", count: 5 },
              { service: "Google Analytics", status: "Error", count: 1 },
              { service: "Salesforce", status: "Connected", count: 2 },
            ].map((connection, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      connection.status === "Connected"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-700">
                    {connection.service}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {connection.count} sources
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataLibrary;
