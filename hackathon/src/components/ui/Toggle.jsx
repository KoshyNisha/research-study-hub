import React from 'react';

const Toggle = ({
  checked,
  onChange,
  label,
  description,
  disabled = false
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2
            focus:ring-[#00274C] focus:ring-offset-2
            ${checked ? 'bg-[#00274C]' : 'bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full
              bg-white shadow ring-0 transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0.5'}
              mt-0.5
            `}
          />
        </button>
      </div>
      <div className="ml-3 text-sm">
        {label && (
          <label className="font-medium text-gray-900 cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
            {label}
          </label>
        )}
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Toggle;
