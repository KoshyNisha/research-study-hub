import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, BookOpen, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import MatchScore from './MatchScore';

const LabCard = ({ lab }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lab/${lab.id}`);
  };

  return (
    <Card hover onClick={handleClick} className="group cursor-pointer">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Match Score */}
          <div className="flex-shrink-0">
            <MatchScore score={lab.matchScore} size="md" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#00274C] group-hover:text-[#FFCB05] transition-colors">
                  {lab.name}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {lab.department} • {lab.pi}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00274C] transition-colors" />
            </div>

            <p className="text-gray-600 mt-3 line-clamp-2">
              {lab.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {lab.researchAreas.slice(0, 3).map((area) => (
                <Badge key={area} variant="default" size="sm">
                  {area}
                </Badge>
              ))}
              {lab.researchAreas.length > 3 && (
                <Badge variant="default" size="sm">
                  +{lab.researchAreas.length - 3}
                </Badge>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{lab.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{lab.timeCommitment}</span>
              </div>
              {lab.paid && (
                <div className="flex items-center gap-1 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  <span>Paid</span>
                </div>
              )}
              {lab.credit && (
                <div className="flex items-center gap-1 text-blue-600">
                  <BookOpen className="w-4 h-4" />
                  <span>Credit</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LabCard;
