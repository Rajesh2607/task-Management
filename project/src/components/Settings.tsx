import React, { useState, useEffect } from 'react';
import Header from './Header';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notification'>('general');
  const [settings, setSettings] = useState({
    // General settings
    language: 'English (Default)',
    timezone: 'English (Default)',
    timeFormat: '24 Hours',
    
    // Notification settings
    message: true,
    taskUpdate: true,
    taskDeadline: true,
    mentorHelp: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load settings from backend on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Try to load from localStorage first for immediate UI response
        const localSettings = localStorage.getItem('userSettings');
        if (localSettings) {
          const parsed = JSON.parse(localSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }

        // Then try to fetch from server
        const response = await fetch('https://server-dzbq.onrender.com/api/settings');
        if (response.ok) {
          const data = await response.json();
          const serverSettings = {
            language: data.language || 'English (Default)',
            timezone: data.timezone || 'English (Default)',
            timeFormat: data.timeFormat || '24 Hours',
            message: data.message ?? true,
            taskUpdate: data.taskUpdate ?? true,
            taskDeadline: data.taskDeadline ?? true,
            mentorHelp: data.mentorHelp ?? false,
            emailNotifications: data.emailNotifications ?? true,
            pushNotifications: data.pushNotifications ?? true,
            smsNotifications: data.smsNotifications ?? false
          };
          setSettings(serverSettings);
          // Also save to localStorage as backup
          localStorage.setItem('userSettings', JSON.stringify(serverSettings));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Fall back to localStorage if server fails
        const localSettings = localStorage.getItem('userSettings');
        if (localSettings) {
          setSettings(prev => ({ ...prev, ...JSON.parse(localSettings) }));
        }
        setSaveMessage('Using local settings (server unavailable)');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setSaveMessage(null);
    
    try {
      // Always save to localStorage first for immediate response
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Try to save to server
      const response = await fetch('https://server-dzbq.onrender.com/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSaveMessage('Settings saved successfully!');
        } else {
          setSaveMessage('Settings saved locally (server sync failed)');
        }
      } else {
        // If server fails, still count localStorage save as success
        setSaveMessage('Settings saved locally (server unavailable)');
      }
      
      setTimeout(() => setSaveMessage(null), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error saving settings:', error);
      // If server fails but localStorage worked, show partial success
      setSaveMessage('Settings saved locally (server unavailable)');
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const TabButton: React.FC<{ 
    tab: 'general' | 'notification'; 
    label: string; 
    isActive: boolean; 
  }> = ({ tab, label, isActive }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 px-4 lg:px-6 py-3 font-medium text-sm lg:text-base border-b-2 transition-colors ${
        isActive
          ? 'text-blue-600 border-blue-600'
          : 'text-gray-500 border-transparent hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  const ToggleSwitch: React.FC<{ 
    enabled: boolean; 
    onChange: () => void; 
    label: string;
    description?: string;
  }> = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 pr-4">
        <div className="flex items-center space-x-3">
          <div 
            className={`w-2 h-2 rounded-full ${
              enabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
          <span className="font-medium text-gray-900 text-sm lg:text-base">{label}</span>
        </div>
        {description && (
          <p className="text-xs lg:text-sm text-gray-600 mt-1 ml-5">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
          enabled ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectField: React.FC<{
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }> = ({ label, value, options, onChange }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  const RadioGroup: React.FC<{
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }> = ({ label, value, options, onChange }) => (
    <div className="mb-6">
      <label className="block text-sm lg:text-base font-medium text-gray-900 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className={`flex items-center space-x-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors w-full touch-manipulation ${
              value === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === option.value ? 'border-blue-500' : 'border-gray-300'
              }`}>
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </div>
              <span className="text-sm lg:text-base font-medium">{option.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      <Header title="Settings" showFilters={false} />
      
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-xl p-6 lg:p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="bg-white rounded-t-xl border-b border-gray-200">
                <div className="flex">
                  <TabButton 
                    tab="general" 
                    label="General" 
                    isActive={activeTab === 'general'} 
                  />
                  <TabButton 
                    tab="notification" 
                    label="Notification" 
                    isActive={activeTab === 'notification'} 
                  />
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-b-xl p-4 lg:p-8 min-h-96">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  General Settings
                </h3>
                
                <SelectField
                  label="Language"
                  value={settings.language}
                  options={['English (Default)', 'Spanish', 'French', 'German', 'Italian']}
                  onChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
                />

                <SelectField
                  label="Timezone"
                  value={settings.timezone}
                  options={['English (Default)', 'UTC+0', 'UTC-5', 'UTC-8', 'UTC+1']}
                  onChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
                />

                <RadioGroup
                  label="Timezone"
                  value={settings.timeFormat}
                  options={[
                    { value: '24 Hours', label: '24 Hours' },
                    { value: '12 Hours', label: '12 Hours' }
                  ]}
                  onChange={(value) => setSettings(prev => ({ ...prev, timeFormat: value }))}
                />
              </div>
            )}

            {activeTab === 'notification' && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Notification Settings
                </h3>
                
                <ToggleSwitch
                  enabled={settings.message}
                  onChange={() => handleToggle('message')}
                  label="Message"
                />

                <ToggleSwitch
                  enabled={settings.taskUpdate}
                  onChange={() => handleToggle('taskUpdate')}
                  label="Task Update"
                />

                <ToggleSwitch
                  enabled={settings.taskDeadline}
                  onChange={() => handleToggle('taskDeadline')}
                  label="Task Deadline"
                />

                <ToggleSwitch
                  enabled={settings.mentorHelp}
                  onChange={() => handleToggle('mentorHelp')}
                  label="Mentor Help"
                />
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 lg:mt-8">
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                className={`w-full sm:w-auto bg-blue-600 text-white px-6 lg:px-8 py-3 rounded-lg font-medium text-sm lg:text-base transition-colors touch-manipulation ${
                  saving 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-700'
                }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              
              {saveMessage && (
                <div className={`mt-4 p-3 rounded-lg text-xs lg:text-sm font-medium ${
                  saveMessage.includes('Error') 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {saveMessage}
                </div>
              )}
            </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
