import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Bell, Lock, LogOut, Save } from 'lucide-react';
import { Card, CardHeader } from '@/components/Card';
import { TopNav } from '@/components/TopNav';
import { Sidebar } from '@/components/Sidebar';
import { useTheme } from '@/context/ThemeContext';
import { usePreferences } from '@/context/PreferencesContext';

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isDarkMode, setDarkMode } = useTheme();
  const { preferences, profile, updatePreferences, updateProfile } = usePreferences();
  const [localPreferences, setLocalPreferences] = useState({ ...preferences, darkMode: isDarkMode });
  const [localProfile, setLocalProfile] = useState(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalPreferences(prev => ({ ...prev, ...preferences, darkMode: isDarkMode }));
    setLocalProfile(profile);
  }, [preferences, profile, isDarkMode]);

  const handleToggle = (key: keyof typeof localPreferences) => {
    const newValue = !localPreferences[key];
    setLocalPreferences(prev => ({ ...prev, [key]: newValue }));

    // Immediately apply dark mode changes
    if (key === 'darkMode') {
      setDarkMode(newValue);
    }
  };

  const handleProfileChange = (key: string, value: string) => {
    setLocalProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
    updateProfile(localProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SettingToggle = ({ label, description, value, onChange }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div>
        <h3 className="font-medium text-foreground">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-secondary peer-checked:bg-accent rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      <div
        className={`fixed top-16 transition-all duration-300 ${
          sidebarCollapsed ? 'left-20' : 'left-64'
        } right-0 bottom-0 overflow-y-auto`}
      >
        <div className="flex-1 p-8 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
              <Settings size={36} />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your preferences and account</p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-medium">
              Settings saved successfully!
            </div>
          )}

          {/* Profile Section */}
          <Card className="mb-6">
            <CardHeader title="Profile" description="Manage your account information" />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={localProfile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg outline-none focus:border-accent text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={localProfile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg outline-none focus:border-accent text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
                <textarea
                  value={localProfile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg outline-none focus:border-accent text-foreground resize-none"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Display Preferences */}
          <Card className="mb-6">
            <CardHeader title="Display" description="Customize how DailyTrack looks" />
            <div className="divide-y divide-border">
              <div className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? (
                    <Moon size={20} className="text-accent" />
                  ) : (
                    <Sun size={20} className="text-yellow-500" />
                  )}
                  <div>
                    <h3 className="font-medium text-foreground">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">
                      {isDarkMode ? 'Enabled' : 'Use light theme'}
                    </p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => handleToggle('darkMode')}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-secondary peer-checked:bg-accent rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="py-4">
                <label className="block text-sm font-medium text-foreground mb-3">Default View</label>
                <select
                  value={localPreferences.defaultView}
                  onChange={(e) => setLocalPreferences(prev => ({ ...prev, defaultView: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg outline-none focus:border-accent text-foreground"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="today">Today</option>
                  <option value="calendar">Calendar</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader title="Notifications" description="Control how and when you get notified" />
            <div className="divide-y divide-border">
              <SettingToggle
                label="Email Notifications"
                description="Receive email updates about your activities"
                value={localPreferences.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <SettingToggle
                label="Push Notifications"
                description="Get push notifications for reminders and updates"
                value={localPreferences.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
              <SettingToggle
                label="Weekly Digest"
                description="Receive a summary of your weekly progress"
                value={localPreferences.weeklyDigest}
                onChange={() => handleToggle('weeklyDigest')}
              />
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card className="mb-6">
            <CardHeader title="Privacy & Data" description="Control your data and privacy settings" />
            <div className="divide-y divide-border">
              <SettingToggle
                label="Auto-Backup"
                description="Automatically backup your data daily"
                value={localPreferences.dataBackup}
                onChange={() => handleToggle('dataBackup')}
              />
              <div className="py-4">
                <h3 className="font-medium text-foreground flex items-center gap-2 mb-3">
                  <Lock size={18} />
                  Change Password
                </h3>
                <button className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">
                  Update Password
                </button>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="mb-6">
            <CardHeader title="About" description="Information about DailyTrack" />
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-foreground">App Version</span>
                <span className="text-muted-foreground">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-foreground">Last Updated</span>
                <span className="text-muted-foreground">February 3, 2026</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-foreground">License</span>
                <span className="text-muted-foreground">MIT</span>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardHeader
              title="Danger Zone"
              description="Irreversible actions"
            />
            <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
