// Utility functions for dashboard data processing

export const formatTimeLeft = (timeLeft: string | undefined): string => {
  if (!timeLeft) return 'No due date';
  
  // Extract number from timeLeft string like "2 days left"
  const match = timeLeft.match(/(\d+)\s*(day|hour|minute)s?\s*left/i);
  if (match) {
    const [, number, unit] = match;
    return `${number} ${unit}${parseInt(number) > 1 ? 's' : ''} left`;
  }
  
  return timeLeft;
};

export const calculateCompletionRate = (total: number, completed: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatProgress = (progress: number): number => {
  return Math.min(100, Math.max(0, progress));
};

export const getTasksByStatus = (tasks: any[], status: string) => {
  return tasks.filter(task => task.status === status);
};

export const getRecentActivity = (tasks: any[], days: number = 7) => {
  const now = new Date();
  const daysMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const activity = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt || task.updatedAt);
      return taskDate.toDateString() === date.toDateString();
    });

    activity.push({
      day: daysMap[date.getDay()],
      tasks: dayTasks.length,
      date: date.toISOString().split('T')[0]
    });
  }

  return activity;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

export const getTaskPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-600 bg-red-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'in_progress':
      return 'text-blue-600 bg-blue-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'on_hold':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};
