import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageSquare, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ApplicationRow = ({ application }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lab/${application.labId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={handleClick}
      className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#00274C] hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-[#00274C] group-hover:text-[#00274C]">
            {application.labName}
          </h3>
          <StatusBadge status={application.status} />
        </div>

        <p className="text-sm text-gray-600 mt-1">{application.piName}</p>

        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Applied {formatDate(application.dateSubmitted)}</span>
          </div>
          {application.responseMessage && (
            <div className="flex items-center gap-1 text-green-600">
              <MessageSquare className="w-4 h-4" />
              <span className="truncate max-w-xs">{application.responseMessage}</span>
            </div>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00274C] transition-colors" />
    </div>
  );
};

export default ApplicationRow;
