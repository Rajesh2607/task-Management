const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/dashboard - Get dashboard data
router.get('/', async (req, res) => {
  try {
    // Fetch all tasks
    const tasks = await Task.find().sort({ createdAt: -1 });
    
    // Calculate task statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const runningTasks = tasks.filter(task => task.status === 'in_progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const taskStats = {
      total: totalTasks,
      completed: completedTasks,
      running: runningTasks,
      completionRate: completionRate
    };
    
    // Calculate activity data for the last 7 days
    const activityData = [];
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      
      activityData.push({
        day: days[date.getDay()],
        tasks: dayTasks.length
      });
    }
    
    // Get current task (most recent in-progress task)
    const currentTask = tasks.find(task => task.status === 'in_progress') || null;
    
    // Mock mentors data (since we don't have a mentors collection)
    const mentors = [
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
    
    res.json({
      taskStats,
      tasks: tasks.slice(0, 10), // Return first 10 tasks for upcoming tasks
      mentors,
      activityData,
      currentTask
    });
    
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      details: error.message 
    });
  }
});

// GET /api/dashboard/stats - Get just task statistics
router.get('/stats', async (req, res) => {
  try {
    const tasks = await Task.find();
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const runningTasks = tasks.filter(task => task.status === 'in_progress').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    res.json({
      total: totalTasks,
      completed: completedTasks,
      running: runningTasks,
      completionRate: completionRate
    });
    
  } catch (error) {
    console.error('Dashboard stats API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch task statistics',
      details: error.message 
    });
  }
});

module.exports = router;
