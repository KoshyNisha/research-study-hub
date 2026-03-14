import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Sidebar from '../components/layout/Sidebar';
import LabCard from '../components/lab/LabCard';
import { labs, recalculateMatchScores } from '../data/labs';

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentLabs, setCurrentLabs] = useState(labs);
  const [filters, setFilters] = useState({
    minMatchScore: 0,
    paidOnly: false,
    forCredit: false,
    departments: [],
    researchAreas: []
  });

  // Recalculate match scores when component mounts (after potential profile updates)
  useEffect(() => {
    const updatedLabs = recalculateMatchScores();
    setCurrentLabs(updatedLabs);
  }, []);

  // Extract unique departments and research areas
  const departments = useMemo(() =>
    [...new Set(currentLabs.map(lab => lab.department))].sort(),
    [currentLabs]
  );

  const researchAreas = useMemo(() =>
    [...new Set(currentLabs.flatMap(lab => lab.researchAreas))].sort(),
    [currentLabs]
  );

  // Filter labs
  const filteredLabs = useMemo(() => {
    return currentLabs.filter(lab => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          lab.name.toLowerCase().includes(query) ||
          lab.description.toLowerCase().includes(query) ||
          lab.pi.toLowerCase().includes(query) ||
          lab.department.toLowerCase().includes(query) ||
          lab.researchAreas.some(area => area.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Match score
      if (lab.matchScore < filters.minMatchScore) return false;

      // Paid only
      if (filters.paidOnly && !lab.paid) return false;

      // For credit
      if (filters.forCredit && !lab.credit) return false;

      // Departments
      if (filters.departments.length > 0 && !filters.departments.includes(lab.department)) return false;

      // Research areas
      if (filters.researchAreas.length > 0) {
        const hasArea = lab.researchAreas.some(area =>
          filters.researchAreas.includes(area)
        );
        if (!hasArea) return false;
      }

      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [searchQuery, filters]);

  return (
    <PageWrapper>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            filters={filters}
            onFilterChange={setFilters}
            departments={departments}
            researchAreas={researchAreas}
          />
        </div>

        {/* Mobile Filters */}
        <div className={`
          fixed inset-0 z-50 lg:hidden
          ${showMobileFilters ? 'block' : 'hidden'}
        `}>
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <Sidebar
              filters={filters}
              onFilterChange={setFilters}
              departments={departments}
              researchAreas={researchAreas}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search labs, PIs, research areas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00274C] focus:border-[#00274C]"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-[#00274C]">{filteredLabs.length}</span> labs
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm border-gray-300 rounded-lg focus:ring-[#00274C] focus:border-[#00274C]">
                  <option>Match Score</option>
                  <option>Recently Posted</option>
                  <option>Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lab Feed */}
          <div className="p-6">
            {filteredLabs.length > 0 ? (
              <div className="space-y-4">
                {filteredLabs.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No labs found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Discover;
