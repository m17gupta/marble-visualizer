import React from 'react'
import MetricCard from '../shared/MetricCard'

const MetricsGrid = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$1,250.00"
          change={{ value: "+12.5%", type: "increase" }}
          trend={{
            label: "Trending up this month",
            description: "Visitors for the last 6 months"
          }}
        />
        
        <MetricCard
          title="New Customers"
          value="1,234"
          change={{ value: "-20%", type: "decrease" }}
          trend={{
            label: "Down 20% this period",
            description: "Acquisition needs attention"
          }}
        />
        
        <MetricCard
          title="Active Accounts"
          value="45,678"
          change={{ value: "+12.5%", type: "increase" }}
          trend={{
            label: "Strong user retention",
            description: "Engagement exceed targets"
          }}
        />
        
        <MetricCard
          title="Growth Rate"
          value="4.5%"
          change={{ value: "+4.5%", type: "increase" }}
          trend={{
            label: "Steady performance increase",
            description: "Meets growth projections"
          }}
        />
      </div>
  )
}

export default MetricsGrid