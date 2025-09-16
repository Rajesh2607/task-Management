const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get user settings
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    let settings = await Settings.findOne({ userId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings({ userId });
      await settings.save();
    }
    
    res.json(settings);
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update user settings
router.put('/', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    const updateData = { ...req.body, userId };
    
    // Find settings by userId and update, or create new if doesn't exist
    let settings = await Settings.findOneAndUpdate(
      { userId },
      updateData,
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        runValidators: true 
      }
    );
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

// Reset settings to default
router.post('/reset', async (req, res) => {
  try {
    const userId = req.body.userId || 'default-user';
    
    // Delete existing settings
    await Settings.findOneAndDelete({ userId });
    
    // Create new default settings
    const defaultSettings = new Settings({ userId });
    await defaultSettings.save();
    
    res.json({
      success: true,
      message: 'Settings reset to default',
      settings: defaultSettings
    });
  } catch (err) {
    console.error('Error resetting settings:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

module.exports = router;
