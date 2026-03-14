import React from 'react';

const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = true,
  valueFormatter = (v) => `${v}%`
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && <span className="text-sm text-gray-500">{valueFormatter(value)}</span>}
        </div>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00274C]"
          style={{
            background: `linear-gradient(to right, #00274C ${percentage}%, #e5e7eb ${percentage}%)`
          }}
        />
      </div>
    </div>
  );
};

export default Slider;
