import React from 'react';

interface PieChartProps {
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  size?: number;
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  size = 200,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div 
          className="flex items-center justify-center bg-gray-50 rounded-lg"
          style={{ height: `${size}px` }}
        >
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];
  
  let currentAngle = -90; // Start from top

  const createPath = (startAngle: number, endAngle: number, radius: number) => {
    const centerX = size / 2;
    const centerY = size / 2;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="flex items-center space-x-6">
        {/* Pie Chart */}
        <div style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (item.value / total) * 360;
              const endAngle = currentAngle + angle;
              
              const path = createPath(currentAngle, endAngle, size / 2 - 10);
              const color = item.color || colors[index % colors.length];
              
              currentAngle = endAngle;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>{`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}</title>
                </path>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="space-y-2">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="text-sm">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-500 ml-2">
                    {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChart;