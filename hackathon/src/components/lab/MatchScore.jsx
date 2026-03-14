import React from 'react';
import { Sparkles } from 'lucide-react';

const MatchScore = ({ score, size = 'md', showLabel = true }) => {
  const getVariant = () => {
    if (score < 50) return 'gray';
    if (score < 80) return 'blue';
    return 'maize';
  };

  const variant = getVariant();

  const sizes = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  const bgColors = {
    gray: 'bg-gray-100 text-gray-600',
    blue: 'bg-[#00274C] text-white',
    maize: 'bg-[#FFCB05] text-[#00274C]'
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          ${sizes[size]}
          ${bgColors[variant]}
          rounded-full flex flex-col items-center justify-center font-bold
          shadow-sm
        `}
      >
        <span>{score}%</span>
      </div>
      {showLabel && (
        <div className="flex items-center gap-1 mt-1">
          <Sparkles className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">Match</span>
        </div>
      )}
    </div>
  );
};

export default MatchScore;
