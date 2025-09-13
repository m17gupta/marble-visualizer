import React from 'react';

interface BarChartProps {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  height = 200,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div 
          className="flex items-center justify-center bg-gray-50 rounded-lg"
          style={{ height: `${height}px` }}
        >
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3" style={{ height: `${height}px`, overflowY: 'auto' }}>
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100;
          const barColor = item.color || colors[index % colors.length];
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-gray-900 font-semibold">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: barColor 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;