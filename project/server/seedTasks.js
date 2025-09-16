require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

// Sample tasks data
const sampleTasks = [
  {
    title: "Learn Figma Design Fundamentals",
    category: "Design",
    progress: 75,
    timeLeft: "2 days left",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    teamMembers: [
      "https://images.unsplash.com/photo-1494790108755-2616b612d5c3?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    ],
    description: "Master the fundamentals of Figma design tool including components, auto-layout, and prototyping.",
    completed: false
  },
  {
    title: "React TypeScript Development",
    category: "Development",
    progress: 45,
    timeLeft: "5 days left",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    teamMembers: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=32&h=32&fit=crop&crop=face"
    ],
    description: "Build modern web applications using React with TypeScript for better type safety and developer experience.",
    completed: false
  },
  {
    title: "Digital Marketing Strategy",
    category: "Marketing",
    progress: 100,
    timeLeft: "Completed",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    teamMembers: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?w=32&h=32&fit=crop&crop=face"
    ],
    description: "Develop comprehensive digital marketing strategies including SEO, social media, and content marketing.",
    completed: true
  },
  {
    title: "Data Science with Python",
    category: "Data Science",
    progress: 30,
    timeLeft: "1 week left",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    teamMembers: [
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face"
    ],
    description: "Learn data science fundamentals using Python, pandas, numpy, and machine learning libraries.",
    completed: false
  },
  {
    title: "UI/UX Research Methods",
    category: "UI/UX",
    progress: 60,
    timeLeft: "3 days left",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=400&fit=crop",
    teamMembers: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
    ],
    description: "Master user research methodologies including user interviews, usability testing, and persona development.",
    completed: false
  },
  {
    title: "Mobile App Design Patterns",
    category: "Design",
    progress: 85,
    timeLeft: "1 day left",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
    teamMembers: [
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=32&h=32&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1557862921-37829c790f19?w=32&h=32&fit=crop&crop=face"
    ],
    description: "Explore mobile app design patterns and best practices for iOS and Android platforms.",
    completed: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB using the same URI as the server
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskmanager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Insert sample tasks
    await Task.insertMany(sampleTasks);
    console.log('Sample tasks inserted successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();
