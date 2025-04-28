// src/components/Settings.jsx
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import AdminSettings from './AdminSettings';
import { 
  Shield, 
  ChevronLeft, 
  Bell, 
  Mail, 
  Lock, 
  Globe, 
  Monitor, 
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Settings = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApprove, setAutoApprove] = useState(false);
  const [language, setLanguage] = useState('en');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSaveSettings = () => {
    // Save settings to localStorage for persistence
    const settings = {
      notificationsEnabled,
      emailNotifications,
      autoApprove,
      language
    };
    
    localStorage.setItem('moderationSettings', JSON.stringify(settings));
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/request" className="text-sm text-primary hover:underline">
            Submit a Request
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Account Settings</CardTitle>
                <CardDescription>
                  Manage your account and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Change Password</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Email Address</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user ? user.email : 'admin@example.com'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Access Level</span>
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">
                      {user ? user.role : 'admin'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Notification Settings</CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">In-App Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Email Notifications</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Moderation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Moderation Settings</CardTitle>
                <CardDescription>
                  Configure content moderation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Auto-Approve Verified Users</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={autoApprove}
                        onChange={(e) => setAutoApprove(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Display Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Display Settings</CardTitle>
                <CardDescription>
                  Customize your viewing experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground capitalize">
                        {theme === 'dark' ? (
                          <div className="flex items-center gap-1">
                            <Moon className="h-3 w-3" />
                            <span>Dark</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Sun className="h-3 w-3" />
                            <span>Light</span>
                          </div>
                        )}
                      </span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Language</span>
                    </div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <Link to="/dashboard">
              <Button variant="outline">
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
          
          {saveSuccess && (
            <div className="mt-4 p-4 bg-green-500/10 text-green-500 rounded-md text-center">
              Settings saved successfully!
            </div>
          )}
          
          {/* Admin Settings - Only visible to admin users */}
          {user && user.role === 'admin' && (
            <div className="mt-8">
              <AdminSettings />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;