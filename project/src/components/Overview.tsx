import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Clock, 
  MoreHorizontal,
  RefreshCw,
  Loader2,
  TrendingUp,
  Bell,
  Menu
} from 'lucide-react';
import { useDashboardData, useRealTimeUpdates } from '../hooks/useDashboardData';
import { formatTimeLeft, formatProgress, getDaysUntilDue } from '../utils/dashboardUtils';
import PlaceholderImage from './PlaceholderImage';
import LiveClock from './LiveClock';

interface OverviewProps {
  onTaskClick?: (taskId: string) => void;
  onMenuToggle?: () => void;
}

const Overview: React.FC<OverviewProps> = ({ onTaskClick, onMenuToggle }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Use current date
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  // Fetch dashboard data with real-time updates
  const { data: dashboardData, isLoading, error, refreshData } = useDashboardData();
  
  // Set up real-time updates
  useRealTimeUpdates(() => {
    setLastUpdateTime(new Date());
    toast.success('Dashboard data updated!', {
      icon: '🔄',
      duration: 2000,
    });
  });

  // Show success notification when data loads initially
  useEffect(() => {
    if (dashboardData && !isLoading && !error) {
      toast.success('Dashboard loaded successfully!', {
        icon: '✅',
        duration: 2000,
      });
    }
  }, [dashboardData, isLoading, error]);

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      setLastUpdateTime(new Date());
      toast.success('Dashboard refreshed successfully!');
    } catch (err) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Update current time every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setLastUpdateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timeInterval);
  }, []);

  // Show loading state
  if (isLoading && !dashboardData) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching real-time data...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Connecting to API at localhost:5002</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mentors = dashboardData?.mentors || [
    {
      id: '1',
      name: 'Curious George',
      role: 'UI UX Design',
      tasks: 40,
      rating: 4.7,
      reviews: 750,
      avatar: '',
      followed: false
    },
    {
      id: '2',
      name: 'Abraham Lincoln',
      role: '3D Design',
      tasks: 32,
      rating: 4.9,
      reviews: 910,
      avatar: '',
      followed: true
    }
  ];
  
  const upcomingTasks = dashboardData?.tasks?.filter(task => task.status !== 'completed').slice(0, 2) || [
    {
      _id: "demo-1",
      title: "Learn Figma Design Fundamentals",
      description: "Complete the Figma basics course",
      category: "Design",
      progress: 75,
      status: "in_progress",
      priority: "high",
      assignedTo: ["user1", "user2"],
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
      image: "",
      teamMembers: ["", "", ""],
      duration: "2 hours",
      subtasks: []
    },
    {
      _id: "demo-2",
      title: "React TypeScript Development",
      description: "Build a dashboard with React and TypeScript",
      category: "Development",
      progress: 45,
      status: "in_progress",
      priority: "medium",
      assignedTo: ["user3", "user4"],
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
      image: "",
      teamMembers: ["", "", ""],
      duration: "4 hours",
      subtasks: []
    }
  ];
  const currentTask = dashboardData?.currentTask || {
    _id: "current-demo",
    title: "Creating Awesome Mobile Apps",
    description: "Design and develop a mobile application using modern tools",
    category: "UI / UX Designer",
    progress: 90,
    status: "in_progress",
    priority: "high",
    assignedTo: ["user1", "user2"],
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    image: "",
    teamMembers: ["", "", "", ""],
    duration: "1 Hour",
    subtasks: [
      { id: 1, title: "Understanding the tools in Figma", completed: true },
      { id: 2, title: "Understand the basics of making designs", completed: true },
      { id: 3, title: "Design a mobile application with figma", completed: false }
    ]
  };
  const activityData = dashboardData?.activityData || [
    { day: 'M', tasks: 1 },
    { day: 'T', tasks: 2 },
    { day: 'W', tasks: 3 },
    { day: 'T', tasks: 2 },
    { day: 'F', tasks: 2.5 },
    { day: 'S', tasks: 2.8 },
    { day: 'S', tasks: 2.5 }
  ];

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isToday: isCurrentMonth && day === todayDate
      });
    }
    
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto relative">
      {/* Loading Overlay */}
      {(isLoading || isRefreshing) && (
        <div className="absolute inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isLoading ? 'Loading Dashboard' : 'Refreshing Data'}
            </h2>
            <p className="text-gray-600">
              {isLoading ? 'Fetching real-time data...' : 'Updating dashboard information...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 lg:mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">Hi, Dennis Nzioki</h1>
              <p className="text-gray-600 text-sm lg:text-base">Let's finish your task today!</p>
              <div className="mt-2">
                <LiveClock />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Last updated: {lastUpdateTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh Dashboard"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin text-blue-600" />
              ) : (
                <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              )}
            </button>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">
                {error ? 'Offline' : isLoading ? 'Connecting...' : 'Live'}
              </span>
            </div>
            <button className="relative p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="Dennis Nzioki"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            {/* Task Statistics and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Running Task Card */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <h3 className="text-sm font-medium text-gray-300 mb-6">Running Task</h3>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-5xl font-bold text-white mb-2">65</div>
                    <div className="flex items-baseline space-x-2">
                      <div className="text-2xl font-bold text-blue-400">45%</div>
                      <div className="text-sm text-gray-400 leading-tight">
                        <div>100</div>
                        <div>Task</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="#3B82F6"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray="119 264"
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-white rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">This Week</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-end space-x-4 h-32">
                  {activityData.length > 0 ? activityData.map((item, index) => {
                    const maxTasks = Math.max(...activityData.map(d => d.tasks), 1);
                    const height = (item.tasks / maxTasks) * 80 + 20; // Min 20%, max 100%
                    
                    return (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                        <div className="flex-1 flex items-end">
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              index === 1 ? 'bg-gray-900' : 'bg-gray-200'
                            }`}
                            style={{ height: `${height}%` }}
                            title={`${item.tasks} tasks on ${item.day}`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{item.day}</span>
                      </div>
                    );
                  }) : (
                    // Fallback activity data
                    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                        <div className="flex-1 flex items-end">
                          <div 
                            className={`w-full rounded-t-sm ${index === 1 ? 'bg-gray-900' : 'bg-gray-200'}`}
                            style={{ height: `${Math.random() * 60 + 20}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{day}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4">
                  <svg viewBox="0 0 300 60" className="w-full h-12">
                    <path
                      d="M 0 40 Q 50 30 100 35 T 200 25 T 300 30"
                      stroke="#374151"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="50" cy="35" r="3" fill="#374151" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Monthly Mentors */}
            <div className="bg-white rounded-2xl p-4 lg:p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">Monthly Mentors</h3>
                <div className="flex space-x-2">
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      const container = document.getElementById('mentors-container');
                      if (container) {
                        container.scrollBy({ left: -280, behavior: 'smooth' });
                      }
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  </button>
                  <button 
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                      const container = document.getElementById('mentors-container');
                      if (container) {
                        container.scrollBy({ left: 280, behavior: 'smooth' });
                      }
                    }}
                  >
                    <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div 
                id="mentors-container"
                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="flex-shrink-0 w-64 border border-gray-100 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <PlaceholderImage 
                          type="avatar" 
                          className="w-12 h-12 rounded-full flex-shrink-0" 
                          alt={mentor.name}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{mentor.name}</h4>
                          <p className="text-xs text-gray-600 truncate">{mentor.role}</p>
                        </div>
                      </div>
                      <button className={`px-3 py-1 rounded-full text-xs transition-colors flex-shrink-0 ml-2 ${
                        mentor.followed 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        {mentor.followed ? 'Followed' : 'Follow'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">{mentor.tasks} Task</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="font-medium">{mentor.rating}</span>
                        <span className="text-gray-500">({mentor.reviews} Reviews)</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Task</h3>
                  <p className="text-sm text-gray-500">{upcomingTasks.length} active tasks</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-1">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
                  <div 
                    key={task._id} 
                    className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 transition-all duration-200"
                    onClick={() => onTaskClick?.(task._id)}
                  >
                    <div className="h-32 bg-gray-100 relative">
                      <PlaceholderImage 
                        type="task" 
                        className="w-full h-full rounded-none" 
                        alt={task.title}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">{task.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{task.category}</p>
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-blue-600">{formatProgress(task.progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${formatProgress(task.progress)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {task.dueDate ? `${getDaysUntilDue(task.dueDate)} days left` : 'No due date'}
                          </span>
                        </div>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((_, index) => (
                            <PlaceholderImage 
                              key={index}
                              type="avatar" 
                              className="w-6 h-6 rounded-full border-2 border-white" 
                              alt={`Team member ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-1 sm:col-span-2 text-center py-8">
                    <p className="text-gray-500">No upcoming tasks found</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Refresh to load tasks
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            {/* Calendar */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{formatMonth(currentDate)}</h3>
                  <p className="text-xs text-gray-500">
                    Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => navigateMonth('prev')} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <button onClick={() => navigateMonth('next')} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar().map((dayData, index) => (
                  <div
                    key={index}
                    className={`h-8 flex items-center justify-center text-sm cursor-pointer rounded transition-colors ${
                      dayData?.isToday
                        ? 'bg-blue-600 text-white'
                        : dayData
                        ? 'hover:bg-gray-100 text-gray-700'
                        : 'text-gray-300'
                    }`}
                  >
                    {dayData?.day || ''}
                  </div>
                ))}
              </div>
            </div>

            {/* Task Today */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Task Today</h3>
                <button>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="mb-6">
                <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl relative overflow-hidden mb-4">
                  <PlaceholderImage 
                    type="hero" 
                    className="w-full h-full rounded-xl" 
                    alt="Current Task"
                  />
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{currentTask.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{currentTask.category}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-blue-600">{currentTask.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${currentTask.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{currentTask.duration || '1 Hour'}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((_, index) => (
                      <PlaceholderImage 
                        key={index}
                        type="avatar" 
                        className="w-6 h-6 rounded-full border-2 border-white" 
                        alt={`Team member ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Detail Task */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Detail Task</h4>
                {currentTask?.subtasks ? (
                  <div className="space-y-3">
                    {currentTask.subtasks.map((task, index) => (
                      <div key={task.id} className="flex items-start space-x-3">
                        <span className="text-sm font-medium text-gray-500 mt-0.5">{index + 1}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                            {task.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No subtasks available</p>
                  </div>
                )}
                
                <button 
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-full bg-blue-600 text-white rounded-xl py-3 mt-6 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isRefreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {dashboardData ? 'Refresh Data' : 'Load Tasks'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
