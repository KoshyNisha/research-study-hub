import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import ApplicationRow from '../components/dashboard/ApplicationRow';
import ProfileCompleteness from '../components/dashboard/ProfileCompleteness';
import Button from '../components/ui/Button';
import { applications } from '../data/applications';
import { labs } from '../data/labs';

const Dashboard = () => {
  const statusCounts = {
    Draft: applications.filter(a => a.status === 'Draft').length,
    Sent: applications.filter(a => a.status === 'Sent').length,
    Viewed: applications.filter(a => a.status === 'Viewed').length,
    Responded: applications.filter(a => a.status === 'Responded').length
  };

  const recentLabs = labs.slice(0, 3);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00274C]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your applications and discover new opportunities</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Draft', count: statusCounts.Draft, icon: AlertCircle, color: 'gray' },
                { label: 'Sent', count: statusCounts.Sent, icon: CheckCircle2, color: 'blue' },
                { label: 'Viewed', count: statusCounts.Viewed, icon: Clock, color: 'amber' },
                { label: 'Responded', count: statusCounts.Responded, icon: CheckCircle2, color: 'green' }
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{stat.label}</span>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                  </div>
                  <div className="text-2xl font-bold text-[#00274C]">{stat.count}</div>
                </div>
              ))}
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#00274C]">Your Applications</h2>
                <Link to="/discover" className="text-sm text-[#00274C] hover:text-[#FFCB05] flex items-center gap-1">
                  Find more labs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app.id} className="p-4">
                      <ApplicationRow application={app} />
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FlaskConical className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No applications yet</p>
                    <Link to="/discover">
                      <Button variant="primary" size="sm">Browse Labs</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Labs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#00274C]">Recommended for You</h2>
                <Link to="/discover" className="text-sm text-[#00274C] hover:text-[#FFCB05]">
                  View all
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {recentLabs.map((lab) => (
                  <Link
                    key={lab.id}
                    to={`/lab/${lab.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#FFCB05] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-[#00274C] text-sm line-clamp-1">{lab.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        lab.matchScore >= 80 ? 'bg-[#FFCB05] text-[#00274C]' :
                        lab.matchScore >= 50 ? 'bg-[#00274C] text-white' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {lab.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{lab.pi}</p>
                    <div className="flex flex-wrap gap-1">
                      {lab.researchAreas.slice(0, 2).map((area) => (
                        <span key={area} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {area}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCompleteness />

            {/* Quick Tips */}
            <div className="bg-[#00274C] rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Application Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#FFCB05]">•</span>
                  Personalize your email for each lab
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFCB05]">•</span>
                  Mention specific research projects that interest you
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFCB05]">•</span>
                  Include relevant coursework and skills
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFCB05]">•</span>
                  Follow up after 1-2 weeks if no response
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
