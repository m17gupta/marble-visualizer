import React from 'react';

interface LineChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  height?: number;
  color?: string;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  height = 200,
  color = '#3B82F6',
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
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const generatePath = () => {
    const width = 400;
    const chartHeight = height - 40; // Leave space for axis
    const stepX = width / (data.length - 1);
    
    let path = '';
    data.forEach((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox="0 0 400 200" className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={height * ratio}
              x2="400"
              y2={height * ratio}
              stroke="#F3F4F6"
              strokeWidth="1"
            />
          ))}
          
          {/* Line */}
          <path
            d={generatePath()}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 400;
            const y = height - 40 - ((point.value - minValue) / range) * (height - 40);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {data.map((point, index) => (
            <span key={index} className="transform -translate-x-1/2">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;