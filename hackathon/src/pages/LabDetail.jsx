import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  DollarSign,
  BookOpen,
  Globe,
  ChevronLeft,
  Send,
  Users,
  Calendar,
  CheckCircle2,
  Mail
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import MatchScore from '../components/lab/MatchScore';
import ApplyModal from '../components/lab/ApplyModal';
import { labs } from '../data/labs';
import { getStudentProfile } from '../data/student';

const LabDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const student = getStudentProfile();

  const lab = labs.find(l => l.id === id);

  if (!lab) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lab not found</h1>
          <Button onClick={() => navigate('/discover')} variant="primary">
            Back to Discover
          </Button>
        </div>
      </PageWrapper>
    );
  }

  // Calculate matching skills
  const matchingSkills = student.skills.filter(skill =>
    lab.requirements.some(req =>
      req.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(req.toLowerCase())
    )
  );

  const matchingInterests = student.interests.filter(interest =>
    lab.researchAreas.some(area =>
      area.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(area.toLowerCase())
    )
  );

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-600 hover:text-[#00274C] mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <div className="bg-[#00274C] px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="maize" size="sm">{lab.department}</Badge>
                  {lab.paid && <Badge variant="green" size="sm">Paid</Badge>}
                  {lab.credit && <Badge variant="blue" size="sm">Credit</Badge>}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{lab.name}</h1>
                <p className="text-gray-300">Led by {lab.pi}</p>
              </div>
              <div className="ml-6">
                <MatchScore score={lab.matchScore} size="lg" />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lab.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lab.timeCommitment}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{lab.openPositions} open positions</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Posted {new Date(lab.postedDate).toLocaleDateString()}</span>
              </div>
              <a
                href={`https://${lab.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#00274C] hover:text-[#FFCB05]"
              >
                <Globe className="w-4 h-4" />
                <span>{lab.website}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#00274C] mb-4">About the Lab</h2>
              <p className="text-gray-600 leading-relaxed">{lab.description}</p>
            </div>

            {/* Research Areas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#00274C] mb-4">Research Areas</h2>
              <div className="flex flex-wrap gap-2">
                {lab.researchAreas.map((area) => (
                  <Badge key={area} variant="default" size="md">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#00274C] mb-4">Requirements</h2>
              <ul className="space-y-2">
                {lab.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <Button
                size="lg"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setIsApplyModalOpen(true)}
              >
                <Send className="w-5 h-5" />
                Apply Now
              </Button>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Applications are reviewed on a rolling basis
              </p>
            </div>

            {/* Match Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-[#00274C] mb-4">Why You Match</h3>

              {matchingInterests.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Matching Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {matchingInterests.map((interest) => (
                      <span key={interest} className="px-2 py-1 bg-[#FFCB05]/20 text-[#00274C] text-xs rounded-full font-medium">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchingSkills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Matching Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {matchingSkills.map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-[#00274C]/10 text-[#00274C] text-xs rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {matchingInterests.length === 0 && matchingSkills.length === 0 && (
                <p className="text-sm text-gray-500">
                  Complete your profile to see personalized match details.
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-[#00274C] mb-4">Contact</h3>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${lab.piEmail}`} className="text-[#00274C] hover:text-[#FFCB05]">
                  {lab.piEmail}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        lab={lab}
      />
    </PageWrapper>
  );
};

export default LabDetail;
