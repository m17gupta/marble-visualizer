import React from 'react'

const AdditionalTable = () => {
  return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Metric</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Current</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Previous</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Change</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "User Engagement", current: "78.5%", previous: "72.1%", change: "+6.4%", status: "good" },
                { metric: "Conversion Rate", current: "3.2%", previous: "2.8%", change: "+0.4%", status: "good" },
                { metric: "Bounce Rate", current: "42.1%", previous: "45.3%", change: "-3.2%", status: "good" },
                { metric: "Page Load Time", current: "1.2s", previous: "1.5s", change: "-0.3s", status: "excellent" },
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.metric}</td>
                  <td className="py-3 px-4 text-gray-700">{row.current}</td>
                  <td className="py-3 px-4 text-gray-700">{row.previous}</td>
                  <td className={`py-3 px-4 font-medium ${
                    row.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {row.change}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      row.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default AdditionalTable