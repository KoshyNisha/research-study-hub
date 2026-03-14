import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FlaskConical, Search, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/discover', label: 'Discover', icon: Search },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#00274C] rounded-lg flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-[#FFCB05]" />
              </div>
              <span className="text-xl font-bold text-[#00274C]">LabBridge</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${isActive(item.path)
                    ? 'bg-[#00274C] text-white'
                    : 'text-gray-600 hover:text-[#00274C] hover:bg-gray-50'
                  }
                `}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
              <div className="w-7 h-7 bg-[#00274C] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Jane Doe</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
