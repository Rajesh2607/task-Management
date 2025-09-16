const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get task statistics
router.get('/stats', async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const activeTasks = await Task.countDocuments({ completed: false });
    
    // Tasks created in the last week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newTasks = await Task.countDocuments({ 
      createdAt: { $gte: weekAgo },
      completed: false 
    });

    // Average progress
    const progressResult = await Task.aggregate([
      { $group: { _id: null, avgProgress: { $avg: '$progress' } } }
    ]);
    const averageProgress = progressResult[0]?.avgProgress || 0;

    // Tasks by category
    const categoryStats = await Task.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalTasks,
      completedTasks,
      activeTasks,
      newTasks,
      averageProgress: Math.round(averageProgress),
      categoryStats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = new Task({ title, description });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
