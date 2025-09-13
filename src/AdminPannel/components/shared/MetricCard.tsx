import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  trend?: {
    label: string;
    description: string;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{change.type === 'increase' ? '↗' : '↘'}</span>
            <span>{change.value}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      {/* Trend */}
      {trend && (
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">{trend.label}</p>
          <p className="text-sm text-gray-500">{trend.description}</p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;