import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getStoredProfile } from '../data/student';

const departmentOptions = [
  {
    name: 'Biology',
    interests: ['Genetics', 'Ecology', 'Neuroscience', 'Microbiology']
  },
  {
    name: 'Computer Science',
    interests: ['AI / ML', 'Systems', 'HCI', 'Security']
  },
  {
    name: 'Information',
    interests: ['UX Research', 'Data Science', 'Information Policy', 'Library Science']
  },
  {
    name: 'Robotics',
    interests: ['Autonomy', 'Human-Robot Interaction', 'Control Systems', 'Robotic Perception']
  },
  {
    name: 'Chemistry',
    interests: ['Analytical', 'Biochemistry', 'Materials', 'Physical Chemistry']
  },
  {
    name: 'Public Health',
    interests: ['Epidemiology', 'Global Health', 'Health Informatics', 'Community Health']
  }
];

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [major, setMajor] = useState('');
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedProfile = getStoredProfile();
    if (!storedProfile) return;

    setName(storedProfile.name || '');
    setEmail(storedProfile.email || '');
    setYear(storedProfile.year || '');
    setMajor(storedProfile.major || '');
    setSelected(storedProfile.interestsByDepartment || {});
  }, []);

  const handleToggle = (department, interest) => {
    setSelected((prev) => {
      const current = new Set(prev[department] || []);
      if (current.has(interest)) {
        current.delete(interest);
      } else {
        current.add(interest);
      }
      return { ...prev, [department]: Array.from(current) };
    });
  };

  const selectedBadges = useMemo(() => {
    return Object.entries(selected).flatMap(([department, interests]) =>
      interests.map((interest) => ({ department, interest }))
    );
  }, [selected]);

  const totalSelected = selectedBadges.length;

  const handleSaveProfile = () => {
    const payload = {
      name,
      email,
      year,
      major,
      interestsByDepartment: selected,
      interests: selectedBadges.map((item) => item.interest)
    };

    localStorage.setItem('labbridge.profile', JSON.stringify(payload));
    navigate('/profile');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create your research profile</h1>
        <p className="text-gray-600 mt-2">
          Tell us your name and the research areas you want to explore. We will use this to
          personalize opportunities for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00274C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@umich.edu"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00274C]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="year">
                  Academic year
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00274C]"
                >
                  <option value="">Select year</option>
                  <option value="First-year">First-year</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                  <option value="Postdoc">Postdoc</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="major">
                  Major / Program
                </label>
                <input
                  id="major"
                  type="text"
                  value={major}
                  onChange={(event) => setMajor(event.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00274C]"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Research interests by department</h3>
                <p className="text-sm text-gray-500">Select all areas that match your interests.</p>
              </div>

              {departmentOptions.map((department) => (
                <div key={department.name} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">{department.name}</h4>
                    <span className="text-xs text-gray-500">
                      {(selected[department.name] || []).length} selected
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {department.interests.map((interest) => {
                      const checked = (selected[department.name] || []).includes(interest);
                      return (
                        <label
                          key={interest}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                            checked
                              ? 'border-[#00274C] bg-[#00274C]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-[#00274C] focus:ring-[#00274C]"
                            checked={checked}
                            onChange={() => handleToggle(department.name, interest)}
                          />
                          <span className="text-sm text-gray-700">{interest}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {totalSelected > 0 ? `${totalSelected} interests selected` : 'Select at least one interest.'}
            </div>
            <Button
              variant="maize"
              disabled={!name || !email || !year || !major || totalSelected === 0}
              onClick={handleSaveProfile}
            >
              Save profile
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Student</p>
                <p className="text-lg font-semibold text-gray-900">{name || 'Your name'}</p>
                <p className="text-sm text-gray-500">{email || 'your.email@umich.edu'}</p>
                <p className="text-sm text-gray-500">
                  {[major || 'Major / Program', year || 'Year'].join(' • ')}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Interests</p>
                {totalSelected === 0 ? (
                  <p className="text-sm text-gray-500">No interests selected yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedBadges.map((item) => (
                      <Badge key={`${item.department}-${item.interest}`} variant="blue" size="sm">
                        {item.interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
