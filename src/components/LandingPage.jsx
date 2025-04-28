// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { 
  Shield, 
  FileText, 
  UserCheck, 
  MessageSquare,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Content Moderation System</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm text-primary hover:underline">
            Moderator Login
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 p-6 flex flex-col justify-center">
        <div className="mx-auto text-center mb-12 max-w-2xl">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Content Moderation System</h1>
          <p className="text-xl text-muted-foreground">
            A streamlined platform for content removal requests and moderation
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {/* Submit Request Card */}
          <Card className="transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Submit a Request
              </CardTitle>
              <CardDescription>
                Request removal of your content from our platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete a simple form to request content removal. Our moderation team will review your submission promptly.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/request" className="w-full">
                <Button className="w-full flex items-center gap-2">
                  Submit Request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Moderator Login Card */}
          <Card className="transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Moderator Access
              </CardTitle>
              <CardDescription>
                Login to the moderation dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Authorized moderators can access the dashboard to review, approve, or reject content removal requests.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/dashboard" className="w-full">
                <Button className="w-full flex items-center gap-2" variant="outline">
                  Moderator Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Contact Support Card */}
          <Card className="transform transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Get help with your content removal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Have questions about the process? Our support team is ready to assist you with any inquiries.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/contact" className="w-full">
                <Button className="w-full flex items-center gap-2" variant="outline">
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center text-muted-foreground">
          <p>
            For more information about our content moderation policies, please visit our 
            <Button variant="link" className="p-0 h-auto mx-1 text-primary inline-flex items-center">
              documentation
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </p>
        </div>
      </main>
      
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <p>&copy; 2025 Content Moderation System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;