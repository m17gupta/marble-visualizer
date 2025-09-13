import React from 'react'

const ChartSection = () => {
  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Total Visitors Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Visitors</h3>
            <div className="flex space-x-2 text-sm">
              <span className="px-2 py-1 bg-gray-100 rounded">Last 3 months</span>
              <span className="px-2 py-1 bg-gray-100 rounded">Last 30 days</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Last 7 days</span>
            </div>
          </div>
          
          {/* Simple chart placeholder */}
          <div className="h-64 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-gray-600">Visitor Analytics Chart</p>
              <p className="text-sm text-gray-500">Chart component will be rendered here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "New user registration", user: "John Doe", time: "2 mins ago" },
              { action: "Project created", user: "Jane Smith", time: "5 mins ago" },
              { action: "Payment received", user: "Mike Johnson", time: "10 mins ago" },
              { action: "Report generated", user: "Sarah Wilson", time: "15 mins ago" },
              { action: "Team member added", user: "David Brown", time: "20 mins ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">•</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default ChartSection