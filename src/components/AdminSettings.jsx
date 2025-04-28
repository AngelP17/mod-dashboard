// src/components/AdminSettings.jsx
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { 
  Shield, 
  UserPlus, 
  UserX,
  AlertCircle,
  Check,
  Users
} from 'lucide-react';
import { useAuth } from './AuthContext';

const AdminSettings = () => {
  const { user, moderators, addModerator, updateModerator, deleteModerator } = useAuth();
  
  // State for form fields
  const [newModEmail, setNewModEmail] = useState('');
  const [newModPassword, setNewModPassword] = useState('');
  const [newModName, setNewModName] = useState('');
  const [newModRole, setNewModRole] = useState('moderator');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Check if user is admin
  const isAdmin = user && user.role === 'admin';
  
  if (!isAdmin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-foreground">Administrator Settings</CardTitle>
          <CardDescription className="text-destructive">
            You don't have administrator privileges to access this section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is restricted to users with administrator roles. If you believe you should have access, please contact your system administrator.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Handle add moderator
  const handleAddModerator = (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Basic validation
    if (!newModEmail || !newModPassword || !newModName) {
      setSubmitError('All fields are required');
      return;
    }
    
    // Check if email already exists
    if (moderators.some(mod => mod.email === newModEmail)) {
      setSubmitError('A user with this email already exists');
      return;
    }
    
    // Create new moderator
    const newModerator = {
      email: newModEmail,
      password: newModPassword,
      name: newModName,
      role: newModRole
    };
    
    addModerator(newModerator);
    
    // Show success message and reset form
    setSubmitSuccess(true);
    setNewModEmail('');
    setNewModPassword('');
    setNewModName('');
    setNewModRole('moderator');
    
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 3000);
  };
  
  // Function to change moderator role
  const toggleModeratorRole = (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'moderator' : 'admin';
    updateModerator(id, { role: newRole });
  };
  
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Administrator Settings
          </CardTitle>
          <CardDescription>
            Manage user accounts and system-wide settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Moderator Form */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Add New Moderator</h3>
            <form onSubmit={handleAddModerator} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="moderator@example.com"
                  value={newModEmail}
                  onChange={(e) => setNewModEmail(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="•••••••••"
                  value={newModPassword}
                  onChange={(e) => setNewModPassword(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Role
                </label>
                <select
                  value={newModRole}
                  onChange={(e) => setNewModRole(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="moderator">Moderator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{submitError}</span>
                </div>
              )}
              
              {submitSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-500 rounded-md">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">User added successfully</span>
                </div>
              )}
              
              <Button type="submit" className="w-full flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Moderator
              </Button>
            </form>
          </div>
          
          {/* Current Moderators List */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Current Moderators</h3>
            <div className="space-y-3">
              {moderators.map(mod => (
                <div 
                  key={mod.id}
                  className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-primary">{mod.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{mod.name}</p>
                      <p className="text-sm text-muted-foreground">{mod.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      mod.role === 'admin' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {mod.role}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleModeratorRole(mod.id, mod.role)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {mod.role === 'admin' ? 'Make Moderator' : 'Make Admin'}
                    </Button>
                    {user.id !== mod.id && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete the account for ${mod.name}?`)) {
                            deleteModerator(mod.id);
                          }
                        }}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;