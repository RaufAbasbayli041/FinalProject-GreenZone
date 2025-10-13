import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue' 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      bgLight: 'bg-green-50',
    },
    yellow: {
      bg: 'bg-yellow-500',
      text: 'text-yellow-600',
      bgLight: 'bg-yellow-50',
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      bgLight: 'bg-red-50',
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50',
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`${classes.bgLight} p-3 rounded-md`}>
              <Icon className={`h-6 w-6 ${classes.text}`} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isPositive ? '+' : ''}{trend.value}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
