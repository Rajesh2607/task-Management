import useSWR from 'swr';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { mockDashboardData } from '../data/mockData';

// Fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then(res => res.data);

// Types for the dashboard data
export interface TaskStats {
  total: number;
  completed: number;
  running: number;
  completionRate: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tasks: number;
  rating: number;
  reviews: number;
  followed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  daysLeft?: number;
  status: string;
  priority: string;
  assignedTo: string[];
  createdAt: string;
  dueDate: string;
  image?: string;
  teamMembers?: string[];
  duration?: string;
  subtasks?: { id: number; title: string; completed: boolean; }[];
}

export interface ActivityData {
  day: string;
  tasks: number;
}

export interface DashboardData {
  taskStats: TaskStats;
  tasks: Task[];
  mentors: Mentor[];
  activityData: ActivityData[];
  currentTask: Task | null;
}

// Custom hook for fetching dashboard data
export const useDashboardData = () => {
  // Fetch dashboard data all at once
  const { data: apiDashboardData, error: dashboardError, mutate: mutateDashboard } = useSWR<DashboardData>(
    API_ENDPOINTS.DASHBOARD,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (error) => {
        console.warn('Dashboard API error, using fallback data:', error);
      }
    }
  );

  // If we have dashboard data from API, use it
  if (apiDashboardData) {
    const isLoading = false;
    const isError = false;
    const mutate = () => {
      mutateDashboard();
    };

    return {
      dashboardData: apiDashboardData,
      isLoading,
      isError,
      mutate
    };
  }

  // Fallback: Fetch tasks and stats separately
  const { data: tasks, error: tasksError, mutate: mutateTasks } = useSWR<Task[]>(
    API_ENDPOINTS.TASKS,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (error) => {
        console.warn('Tasks API error:', error);
      }
    }
  );

  // Fetch task statistics as fallback
  const { data: taskStats, error: statsError, mutate: mutateStats } = useSWR<TaskStats>(
    API_ENDPOINTS.TASK_STATS,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onError: (error) => {
        console.warn('Task stats API error:', error);
      }
    }
  );

  // Calculate activity data from tasks
  const calculateActivityData = (tasks: Task[]): ActivityData[] => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const now = new Date();
    const activityData: ActivityData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayTasks = tasks?.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      }) || [];
      
      activityData.push({
        day: days[date.getDay()],
        tasks: dayTasks.length
      });
    }
    
    return activityData;
  };

  // Generate mock mentors data (since there's no mentors API endpoint)
  const generateMentorsData = (): Mentor[] => [
    {
      id: '1',
      name: 'Curious George',
      role: 'UI UX Design',
      tasks: 40,
      rating: 4.7,
      reviews: 750,
      avatar: '/api/placeholder/40/40',
      followed: false
    },
    {
      id: '2',
      name: 'Abraham Lincoln',
      role: '3D Design',
      tasks: 32,
      rating: 4.9,
      reviews: 910,
      avatar: '/api/placeholder/40/40',
      followed: true
    }
  ];

  // Get current task (task in progress)
  const getCurrentTask = (tasks: Task[]): Task | null => {
    if (!tasks || tasks.length === 0) {
      // Return a default current task for demo purposes
      return {
        _id: "demo-task-1",
        title: "Creating Awesome Mobile Apps",
        description: "Design and develop a mobile application using modern tools",
        category: "UI / UX Designer",
        progress: 90,
        status: "in_progress",
        priority: "high",
        assignedTo: ["user1", "user2"],
        createdAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        image: "",
        teamMembers: ["", "", "", ""],
        duration: "1 Hour",
        subtasks: [
          { id: 1, title: "Understanding the tools in Figma", completed: true },
          { id: 2, title: "Understand the basics of making designs", completed: true },
          { id: 3, title: "Design a mobile application with figma", completed: false }
        ]
      };
    }
    return tasks.find(task => task.status === 'in_progress') || tasks[0];
  };

  // Prepare dashboard data with fallback
  const dashboardData: DashboardData | null = tasks || taskStats ? {
    taskStats: taskStats || {
      total: tasks?.length || 0,
      completed: tasks?.filter(t => t.status === 'completed').length || 0,
      running: tasks?.filter(t => t.status === 'in_progress').length || 0,
      completionRate: (tasks && tasks.length > 0) ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
    },
    tasks: tasks?.map(task => ({
      ...task,
      daysLeft: task.dueDate ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
      image: task.image || '',
      teamMembers: ['/api/placeholder/24/24', '/api/placeholder/24/24', '/api/placeholder/24/24'],
      duration: '1 Hour',
      subtasks: [
        { id: 1, title: 'Understanding the tools in Figma', completed: true },
        { id: 2, title: 'Understand the basics of making designs', completed: true },
        { id: 3, title: 'Design a mobile application with figma', completed: false }
      ]
    })) || [],
    mentors: generateMentorsData(),
    activityData: calculateActivityData(tasks || []),
    currentTask: getCurrentTask(tasks || [])
  } : null;

  const error = tasksError || statsError;
  const isLoading = !tasks && !error;

  // Always ensure we have valid data by using fallback
  const finalDashboardData = apiDashboardData || dashboardData || {
    taskStats: { 
      running: 65, 
      total: 100, 
      completed: 45, 
      completionRate: 45 
    },
    tasks: [],
    mentors: [
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
    ],
    activityData: [
      { day: 'M', tasks: 1 },
      { day: 'T', tasks: 2 },
      { day: 'W', tasks: 3 },
      { day: 'T', tasks: 2 },
      { day: 'F', tasks: 1 },
      { day: 'S', tasks: 0 },
      { day: 'S', tasks: 1 }
    ],
    currentTask: {
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
    }
  };

  // Refresh all data
  const refreshData = () => {
    mutateTasks();
    mutateStats();
  };

  return {
    data: finalDashboardData,
    isLoading,
    error,
    refreshData
  };
};

// Hook for real-time updates
export const useRealTimeUpdates = (onUpdate: () => void) => {
  // Set up polling for real-time updates
  const { mutate } = useSWR(API_ENDPOINTS.TASKS, fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    onSuccess: onUpdate
  });

  return { mutate };
};
