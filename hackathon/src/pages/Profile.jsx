import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getStudentProfile } from '../data/student';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const mergedProfile = getStudentProfile();

  const departments = mergedProfile.interestsByDepartment
    ? Object.entries(mergedProfile.interestsByDepartment)
    : [];

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>
            <p className="text-gray-600 mt-2">
              Review the details we will use to personalize research opportunities.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/signup', { state: { fromProfile: true } })}>
            Edit profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Student details</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Name</p>
                <p className="text-lg font-semibold text-gray-900">{mergedProfile.name}</p>
                <p className="text-sm text-gray-500">{mergedProfile.email}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Major / Program</p>
                  <p className="text-sm font-medium text-gray-800">{mergedProfile.major}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Academic year</p>
                  <p className="text-sm font-medium text-gray-800">{mergedProfile.year}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Top interests</p>
                <div className="flex flex-wrap gap-2">
                  {mergedProfile.interests.map((interest) => (
                    <Badge key={interest} variant="blue" size="sm">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Interests by department</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {departments.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No department breakdown saved yet. Add interests to see them here.
                </p>
              ) : (
                departments.map(([department, interests]) => (
                  <div key={department}>
                    <p className="text-sm font-semibold text-gray-800 mb-2">{department}</p>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge key={`${department}-${interest}`} variant="outline" size="sm">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
