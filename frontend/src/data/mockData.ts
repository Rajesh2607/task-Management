// Mock data for development and testing
export const mockDashboardData = {
  taskStats: {
    total: 100,
    completed: 45,
    running: 65,
    completionRate: 45
  },
  tasks: [
    {
      _id: "1",
      title: "Learn Figma Design Fundamentals",
      description: "Complete the Figma basics course",
      category: "Design",
      progress: 75,
      status: "in_progress",
      priority: "high",
      assignedTo: ["user1", "user2"],
      createdAt: "2025-09-01T00:00:00Z",
      dueDate: "2025-09-06T00:00:00Z",
      image: "",
      teamMembers: ["", "", ""],
      duration: "2 hours",
      subtasks: [
        { id: 1, title: "Understanding the tools in Figma", completed: true },
        { id: 2, title: "Understand the basics of making designs", completed: true },
        { id: 3, title: "Design a mobile application with figma", completed: false }
      ]
    },
    {
      _id: "2",
      title: "React TypeScript Development",
      description: "Build a dashboard with React and TypeScript",
      category: "Development",
      progress: 45,
      status: "in_progress",
      priority: "medium",
      assignedTo: ["user3", "user4"],
      createdAt: "2025-09-02T00:00:00Z",
      dueDate: "2025-09-10T00:00:00Z",
      image: "",
      teamMembers: ["", "", ""],
      duration: "4 hours",
      subtasks: [
        { id: 1, title: "Set up React project", completed: true },
        { id: 2, title: "Create components", completed: false },
        { id: 3, title: "Add TypeScript types", completed: false }
      ]
    }
  ],
  mentors: [
    {
      id: "1",
      name: "Curious George",
      role: "UI UX Design",
      tasks: 40,
      rating: 4.7,
      reviews: 750,
      avatar: "",
      followed: false
    },
    {
      id: "2",
      name: "Abraham Lincoln",
      role: "3D Design",
      tasks: 32,
      rating: 4.9,
      reviews: 910,
      avatar: "",
      followed: true
    }
  ],
  activityData: [
    { day: 'M', tasks: 1 },
    { day: 'T', tasks: 2 },
    { day: 'W', tasks: 3 },
    { day: 'T', tasks: 2 },
    { day: 'F', tasks: 2.5 },
    { day: 'S', tasks: 2.8 },
    { day: 'S', tasks: 2.5 }
  ],
  currentTask: {
    _id: "1",
    title: "Learn Figma Design Fundamentals",
    description: "Complete the Figma basics course",
    category: "UI / UX Designer",
    progress: 90,
    status: "in_progress",
    priority: "high",
    assignedTo: ["user1", "user2"],
    createdAt: "2025-09-01T00:00:00Z",
    dueDate: "2025-09-06T00:00:00Z",
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
