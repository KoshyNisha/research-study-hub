import React from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import Toggle from '../ui/Toggle';
import Slider from '../ui/Slider';

const Sidebar = ({
  filters,
  onFilterChange,
  departments,
  researchAreas
}) => {
  const handleDepartmentToggle = (dept) => {
    const newDepts = filters.departments.includes(dept)
      ? filters.departments.filter(d => d !== dept)
      : [...filters.departments, dept];
    onFilterChange({ ...filters, departments: newDepts });
  };

  const handleAreaToggle = (area) => {
    const newAreas = filters.researchAreas.includes(area)
      ? filters.researchAreas.filter(a => a !== area)
      : [...filters.researchAreas, area];
    onFilterChange({ ...filters, researchAreas: newAreas });
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-[#00274C]" />
        <h2 className="text-lg font-semibold text-[#00274C]">Filters</h2>
      </div>

      {/* Match Score */}
      <div className="mb-6">
        <Slider
          label="Minimum Match Score"
          value={filters.minMatchScore}
          onChange={(value) => onFilterChange({ ...filters, minMatchScore: value })}
          min={0}
          max={100}
          step={5}
        />
      </div>

      {/* Paid Position */}
      <div className="mb-6">
        <Toggle
          checked={filters.paidOnly}
          onChange={(checked) => onFilterChange({ ...filters, paidOnly: checked })}
          label="Paid positions only"
        />
      </div>

      {/* Credit */}
      <div className="mb-6">
        <Toggle
          checked={filters.forCredit}
          onChange={(checked) => onFilterChange({ ...filters, forCredit: checked })}
          label="For course credit"
        />
      </div>

      {/* Departments */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Departments</h3>
        <div className="space-y-2">
          {departments.map((dept) => (
            <label key={dept} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.departments.includes(dept)}
                onChange={() => handleDepartmentToggle(dept)}
                className="w-4 h-4 rounded border-gray-300 text-[#00274C] focus:ring-[#00274C]"
              />
              <span className="text-sm text-gray-700">{dept}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Research Areas */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Research Areas</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {researchAreas.map((area) => (
            <label key={area} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.researchAreas.includes(area)}
                onChange={() => handleAreaToggle(area)}
                className="w-4 h-4 rounded border-gray-300 text-[#00274C] focus:ring-[#00274C]"
              />
              <span className="text-sm text-gray-700">{area}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange({
          minMatchScore: 0,
          paidOnly: false,
          forCredit: false,
          departments: [],
          researchAreas: []
        })}
        className="w-full py-2 text-sm text-[#00274C] hover:bg-gray-50 rounded-lg transition-colors"
      >
        Clear all filters
      </button>
    </aside>
  );
};

export default Sidebar;
