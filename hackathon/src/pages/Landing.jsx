import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Search, Send, Users, ArrowRight, GraduationCap, Building2, Award } from 'lucide-react';
import Button from '../components/ui/Button';
import PageWrapper from '../components/layout/PageWrapper';
import { labs } from '../data/labs';

const Landing = () => {
  const stats = [
    { label: 'Research Labs', value: '50+', icon: Building2 },
    { label: 'Active Students', value: '1,200+', icon: Users },
    { label: 'Successful Matches', value: '800+', icon: Award },
    { label: 'Departments', value: '15', icon: GraduationCap }
  ];

  const features = [
    {
      icon: Search,
      title: 'Discover Labs',
      description: 'Browse research opportunities across all UMich departments with intelligent matching based on your interests and skills.'
    },
    {
      icon: Send,
      title: 'Apply with Ease',
      description: 'One-click applications with auto-generated personalized emails based on your profile and the lab\'s research focus.'
    },
    {
      icon: FlaskConical,
      title: 'Track Progress',
      description: 'Monitor your applications in real-time. Know when labs view your profile and respond to your inquiries.'
    }
  ];

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#00274C]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFCB05' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[#FFCB05] text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-[#FFCB05]"></span>
              Now open for Winter 2025 applications
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="text-[#FFCB05]"> Research Match</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Research Rabbit connects University of Michigan students with research labs.
              Discover opportunities, apply with personalized emails, and track your applications — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/discover">
                <Button size="lg" variant="maize" className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Explore Labs
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#00274C]">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-[#00274C]/5 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-[#00274C]" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#00274C]">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#00274C] mb-4">How Research Rabbit Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting involved in research has never been easier. Three simple steps to your next research opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={feature.title} className="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#00274C] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-[#FFCB05]" />
                </div>
                <div className="text-sm font-semibold text-[#FFCB05] mb-2">Step {index + 1}</div>
                <h3 className="text-xl font-semibold text-[#00274C] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Labs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#00274C] mb-2">Featured Labs</h2>
              <p className="text-gray-600">Top research opportunities with high match scores</p>
            </div>
            <Link to="/discover" className="flex items-center gap-1 text-[#00274C] hover:text-[#FFCB05] font-medium">
              View all labs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labs.slice(0, 3).map((lab) => (
              <Link
                key={lab.id}
                to={`/lab/${lab.id}`}
                className="group block bg-white rounded-xl border border-gray-200 p-6 hover:border-[#FFCB05] hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#00274C] group-hover:text-[#00274C]">
                      {lab.name}
                    </h3>
                    <p className="text-sm text-gray-500">{lab.department}</p>
                  </div>
                  <div className={`
                    px-3 py-1 rounded-full text-sm font-bold
                    ${lab.matchScore >= 80 ? 'bg-[#FFCB05] text-[#00274C]' :
                      lab.matchScore >= 50 ? 'bg-[#00274C] text-white' :
                      'bg-gray-100 text-gray-600'}
                  `}>
                    {lab.matchScore}%
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {lab.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {lab.researchAreas.slice(0, 2).map((area) => (
                    <span key={area} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#00274C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start your research journey?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join hundreds of Michigan students who have found their perfect research match through Research Rabbit.
          </p>
          <Link to="/discover">
            <Button size="lg" variant="maize" className="flex items-center gap-2 mx-auto">
              <Search className="w-5 h-5" />
              Find Research Labs
            </Button>
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Landing;
