// src/components/ModerationDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useRequests } from './RequestContext';
import { useAuth } from './AuthContext';
import FileViewer from './FileViewer';

import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Search,
  Filter,
  Shield,
  Users,
  Settings,
  LogOut,
  Menu,
  PlusCircle,
  Home
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Input } from './ui/Input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/DropdownMenu';

export const ModeratorDashboard = () => {
  // Auth and navigation
  const { user, login, logout } = useAuth();
  
  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { requests, updateRequest, getStats, getFile, deleteRequest } = useRequests();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingFile, setViewingFile] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update selectedRequest when requests change
  useEffect(() => {
    if (selectedRequest) {
      const updatedRequest = requests.find(r => r.id === selectedRequest.id);
      if (updatedRequest) {
        setSelectedRequest(updatedRequest);
      } else {
        setSelectedRequest(null);
      }
    }
  }, [requests, selectedRequest]);

  // Request handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    // Simulate network delay for a more realistic login experience
    setTimeout(() => {
      const result = login(loginEmail, loginPassword);
      
      if (result.success) {
        // Reset form
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(result.error);
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    setSelectedRequest(null);
  };

  const handleApprove = (id) => {
    updateRequest(id, {
      status: 'approved',
      notes: (selectedRequest.notes || "") + `\nApproved by ${user.name} on ${new Date().toISOString()}`
    });
  };

  const handleReject = (id) => {
    updateRequest(id, {
      status: 'rejected',
      notes: (selectedRequest.notes || "") + `\nRejected by ${user.name} on ${new Date().toISOString()}`
    });
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      deleteRequest(id);
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(null);
      }
    }
  };

  const handleVerifyOwnership = (id) => {
    updateRequest(id, {
      ownershipVerified: true,
      notes: (selectedRequest.notes || "") + `\nOwnership verified by ${user.name} on ${new Date().toISOString()}`
    });
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = getStats();

  // File viewer
  if (viewingFile) {
    return <FileViewer file={viewingFile} onClose={() => setViewingFile(null)} />;
  }

  // Login page
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Back Home Button */}
        <div className="absolute top-4 left-4">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Content Moderation System</h1>
          <p className="text-muted-foreground">Login to access the dashboard</p>
          
          {/* Login Form */}
          <form 
            onSubmit={handleLoginSubmit}
            className="space-y-4 rounded-lg bg-card p-6 shadow-sm border border-border"
          >
            <div className="space-y-2">
              <label className="text-sm text-foreground">Email</label>
              <Input 
                type="email" 
                required 
                placeholder="email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-background text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-foreground">Password</label>
              <Input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-background text-foreground"
              />
            </div>
            
            {loginError && (
              <div className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {loginError}
              </div>
            )}
            
            <Button 
              type="submit" 
              variant="default"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            <div className="pt-2 text-xs text-muted-foreground">
              <p>Demo Accounts:</p>
              <p>admin@example.com / admin123</p>
              <p>moderator@example.com / mod123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  // Main dashboard
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">Moderation</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          
          <hr className="border-t border-border" />
          
          <nav className="flex-1 space-y-2 p-4">
            <Button variant="secondary" className="w-full justify-start gap-2 text-foreground">
              <Users className="h-4 w-4" />
              Requests
            </Button>
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </nav>
          
          <hr className="border-t border-border" />
          
          <div className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium text-foreground">{user.name}</span>
                      <span className="text-muted-foreground">{user.role}</span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-muted-foreground hover:bg-accent focus:bg-accent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Content Removal Requests</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/request">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Request
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Statistics cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-2xl font-bold text-foreground">{stats.pending}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Approved Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold text-foreground">{stats.approved}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Rejected Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-2xl font-bold text-foreground">{stats.rejected}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    High Priority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-2xl font-bold text-foreground">{stats.highPriority}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Request management section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Request list */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Removal Requests</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-8 bg-background text-foreground"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem 
                          onClick={() => setFilterStatus('all')}
                          className="text-muted-foreground hover:bg-accent"
                        >
                          All Requests
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setFilterStatus('pending')}
                          className="text-muted-foreground hover:bg-accent"
                        >
                          Pending Only
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setFilterStatus('approved')}
                          className="text-muted-foreground hover:bg-accent"
                        >
                          Approved Only
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setFilterStatus('rejected')}
                          className="text-muted-foreground hover:bg-accent"
                        >
                          Rejected Only
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {filteredRequests.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No requests found. Try changing your filters.
                      </div>
                    ) : (
                      filteredRequests.map(request => (
                        <div
                          key={request.id}
                          className={`flex cursor-pointer items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/10 ${
                            selectedRequest?.id === request.id ? 'border-primary bg-accent/10' : ''
                          }`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-foreground">{request.email}</p>
                            <p className="text-sm text-muted-foreground break-all">{request.url}</p>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(request.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 ${
                            request.status === 'pending' ? 'text-yellow-500' :
                            request.status === 'approved' ? 'text-green-500' :
                            'text-destructive'
                          }`}>
                            {request.status === 'pending' ? <Clock className="h-4 w-4" /> :
                             request.status === 'approved' ? <CheckCircle2 className="h-4 w-4" /> :
                             <XCircle className="h-4 w-4" />}
                            <span className="text-sm capitalize">{request.status}</span>
                            {request.priority === 'high' && (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Request details */}
              {selectedRequest && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Request Details</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {selectedRequest.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Proof of Ownership</p>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary hover:underline"
                        onClick={async () => {
                          try {
                            // Attempt to fetch the file using the async getFile
                            const file = await getFile(selectedRequest.id);
                            if (file) {
                              setViewingFile(file);
                            } else {
                              // If no file, show an alert
                              alert("File not available. This may be demo data or the file was not properly uploaded.");
                            }
                          } catch (error) {
                            console.error("Error fetching file:", error);
                            alert("An error occurred while retrieving the file.");
                          }
                        }}
                      >
                        {selectedRequest.proofOfOwnership}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Content Type</p>
                      <p className="text-muted-foreground">{selectedRequest.contentType}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Ownership Verified</p>
                      <p className="text-muted-foreground">
                        {selectedRequest.ownershipVerified ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Priority</p>
                      <p className="text-muted-foreground capitalize">{selectedRequest.priority}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-foreground">Notes</p>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {selectedRequest.notes || 'No notes available.'}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <div>
                      <Button 
                        variant="outline" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(selectedRequest.id)}
                      >
                        Delete Request
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleVerifyOwnership(selectedRequest.id)}
                        disabled={selectedRequest.ownershipVerified}
                      >
                        Verify Ownership
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(selectedRequest.id)}
                        disabled={selectedRequest.status === 'rejected'}
                      >
                        Reject
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => handleApprove(selectedRequest.id)}
                        disabled={selectedRequest.status === 'approved'}
                      >
                        Approve
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModeratorDashboard;