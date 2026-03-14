import React from 'react';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { getStudentProfile } from '../../data/student';

const ProfileCompleteness = () => {
  const student = getStudentProfile();
  const completionItems = [
    { label: 'Basic Info', complete: true },
    { label: 'Academic Details', complete: true },
    { label: 'Skills & Interests', complete: student.skills.length >= 3 },
    { label: 'Experience', complete: student.experience.length > 0 },
    { label: 'Resume', complete: !!student.resumeUrl },
    { label: 'Availability', complete: !!student.availability }
  ];

  const completedCount = completionItems.filter(item => item.complete).length;
  const percentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#00274C] rounded-lg flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[#00274C]">Profile Completeness</h3>
          <p className="text-sm text-gray-500">Complete your profile for better matches</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{percentage}% Complete</span>
          <span className="text-gray-500">{completedCount}/{completionItems.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFCB05] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        {completionItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            {item.complete ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-gray-300" />
            )}
            <span className={`text-sm ${item.complete ? 'text-gray-700' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full">
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileCompleteness;
