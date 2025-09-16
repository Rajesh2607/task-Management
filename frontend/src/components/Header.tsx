import React from 'react';
import { Search, Filter, MoreHorizontal, Bell, ChevronDown, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  showFilters?: boolean;
  onSearch?: (query: string) => void;
  onCategoryFilter?: () => void;
  onSort?: () => void;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showFilters = true,
  onSearch,
  onCategoryFilter,
  onSort,
  onMenuToggle
}) => {
  return (
    <div className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 lg:space-x-8">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-lg lg:text-2xl font-semibold text-gray-900">{title}</h1>
          
          {showFilters && (
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Task"
                  onChange={(e) => onSearch?.(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          {showFilters && (
            <>
              <button 
                onClick={onCategoryFilter}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Category</span>
              </button>
              
              <button 
                onClick={onSort}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
                <span className="text-sm font-medium">Sort By: Deadline</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </>
          )}
          
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
          </button>
          
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
