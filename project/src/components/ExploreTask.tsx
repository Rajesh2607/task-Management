import React, { useEffect, useState } from 'react';
import Header from './Header';
import ScrollSection from './ScrollSection';
import TaskCard from './TaskCard';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface ExploreTaskProps {
  onTaskClick: (taskId: string) => void;
  onMenuToggle?: () => void;
}

interface Task {
  _id: string;
  title: string;
  category: string;
  progress: number;
  timeLeft: string;
  image: string;
  teamMembers: string[];
  createdAt: string;
  description?: string;
  completed: boolean;
}

const ExploreTask: React.FC<ExploreTaskProps> = ({ onTaskClick, onMenuToggle }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  // Track current index for each section in mobile view
  const [sectionIndexes, setSectionIndexes] = useState<{ [key: string]: number }>({});

  const categories = ['All', 'Design', 'Development', 'Marketing', 'Data Science', 'UI/UX'];

  // Helper to detect mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const fetchTasks = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      setError(null);
      
      console.log('Fetching tasks from API...');
      const res = await fetch(API_ENDPOINTS.TASKS);
      console.log('Response status:', res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Tasks received:', data.length, 'tasks');
      setTasks(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  const newTasks = activeTasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate > weekAgo;
  });

  const renderSection = (title: string, taskList: Task[]) => {
    if (taskList.length === 0) return null;
    const sectionKey = title;
    // Mobile: show one task at a time with arrows
    if (isMobile) {
      const currentIndex = sectionIndexes[sectionKey] || 0;
      const showTask = taskList[currentIndex] || taskList[0];
      return (
        <div className="mb-6 lg:hidden">{/* Only show on mobile */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-base">{title} ({taskList.length})</span>
            <div className="flex gap-2">
              <button
                aria-label="Previous"
                disabled={currentIndex === 0}
                className={`p-2 rounded-full border border-gray-300 bg-white text-gray-600 disabled:opacity-50`}
                onClick={() => setSectionIndexes(idx => ({ ...idx, [sectionKey]: Math.max(0, currentIndex - 1) }))}
              >
                &#8592;
              </button>
              <button
                aria-label="Next"
                disabled={currentIndex === taskList.length - 1}
                className={`p-2 rounded-full border border-gray-300 bg-white text-gray-600 disabled:opacity-50`}
                onClick={() => setSectionIndexes(idx => ({ ...idx, [sectionKey]: Math.min(taskList.length - 1, currentIndex + 1) }))}
              >
                &#8594;
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <TaskCard
              key={showTask._id}
              {...showTask}
              onClick={() => onTaskClick(showTask._id)}
            />
          </div>
        </div>
      );
    }
    // Desktop: show all tasks in ScrollSection, no arrows
    return (
      <div className="hidden lg:block">{/* Only show on desktop */}
        <ScrollSection title={`${title} (${taskList.length})`}>
          {taskList.map((task) => (
            <TaskCard 
              key={task._id} 
              {...task} 
              onClick={() => onTaskClick(task._id)} 
            />
          ))}
        </ScrollSection>
      </div>
    );
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Explore Task" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <div className="sticky top-0 z-20 bg-gray-50">
        <Header title="Explore Task" onMenuToggle={onMenuToggle} />
      </div>
      <div className="p-4 lg:p-8 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto pb-20">
          {/* Search and Filter Bar */}
          <div className="mb-6 lg:mb-8 bg-white rounded-xl p-4 lg:p-6 shadow-sm">
            {/* Mobile Search - visible only on mobile */}
            <div className="lg:hidden mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <div className="hidden lg:block flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 lg:pl-10 pr-4 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => fetchTasks(true)}
                  disabled={refreshing}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            {/* Task Stats */}
            <div className="grid grid-cols-3 gap-3 lg:gap-6 mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-blue-600">{activeTasks.length}</div>
                <div className="text-xs lg:text-sm text-gray-600">Active Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-green-600">{completedTasks.length}</div>
                <div className="text-xs lg:text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-purple-600">{newTasks.length}</div>
                <div className="text-xs lg:text-sm text-gray-600">New This Week</div>
              </div>
            </div>
          </div>
          {error && (
            <div className="mb-4 lg:mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-red-600 text-sm lg:text-base">{error}</p>
                <button 
                  onClick={() => fetchTasks()}
                  className="px-4 py-2 bg-red-600 text-white text-sm lg:text-base rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {!loading && !error && filteredTasks.length === 0 && (
            <div className="text-center py-8 lg:py-12">
              <p className="text-gray-600 text-base lg:text-lg">No tasks found matching your criteria.</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm lg:text-base rounded-lg hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          )}
          {!loading && !error && filteredTasks.length > 0 && (
            <>
              {renderSection('New Tasks', newTasks)}
              {renderSection('Active Tasks', activeTasks)}
              {renderSection('Completed Tasks', completedTasks)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreTask;
