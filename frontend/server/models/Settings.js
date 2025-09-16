const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    default: 'default-user' // For now, using a default user
  },
  // General settings
  language: { 
    type: String, 
    default: 'English (Default)' 
  },
  timezone: { 
    type: String, 
    default: 'English (Default)' 
  },
  timeFormat: { 
    type: String, 
    default: '24 Hours' 
  },
  
  // Notification settings
  message: { 
    type: Boolean, 
    default: true 
  },
  taskUpdate: { 
    type: Boolean, 
    default: true 
  },
  taskDeadline: { 
    type: Boolean, 
    default: true 
  },
  mentorHelp: { 
    type: Boolean, 
    default: false 
  },
  emailNotifications: { 
    type: Boolean, 
    default: true 
  },
  pushNotifications: { 
    type: Boolean, 
    default: true 
  },
  smsNotifications: { 
    type: Boolean, 
    default: false 
  },
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
SettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', SettingsSchema);
