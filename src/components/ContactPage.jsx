// src/components/ContactPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Input } from './ui/Input';
import { 
  Shield, 
  ChevronLeft, 
  MessageSquare,
  Mail,
  Phone,
  User,
  Send,
  AlertCircle,
  Check
} from 'lucide-react';

const ContactPage = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required';
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!subject) newErrors.subject = 'Subject is required';
    
    if (!message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setSubmitSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Contact Support</h1>
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
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Contact Information */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Get in Touch</CardTitle>
                  <CardDescription>
                    We're here to help with your content moderation needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Email Support</h3>
                      <p className="text-sm text-muted-foreground">support@example.com</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Responses within 24 hours
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mon-Fri, 9am-5pm EST
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Available for verified users</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        24/7 support for urgent issues
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Contact Form</CardTitle>
                  <CardDescription>
                    Send us a message and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                
                {submitSuccess ? (
                  <CardContent className="pt-6">
                    <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-300">
                        Message Sent Successfully
                      </h3>
                      <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                        Thank you for contacting us. We'll respond to your inquiry shortly.
                      </p>
                    </div>
                  </CardContent>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Your Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`pl-10 bg-background text-foreground ${errors.name ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.name}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            type="email"
                            placeholder="your-email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`pl-10 bg-background text-foreground ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.email}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Subject
                        </label>
                        <Input
                          type="text"
                          placeholder="How can we help you?"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={`bg-background text-foreground ${errors.subject ? 'border-destructive' : ''}`}
                        />
                        {errors.subject && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.subject}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Message
                        </label>
                        <textarea
                          placeholder="Please provide details about your inquiry..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`w-full min-h-[150px] rounded-md border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.message ? 'border-destructive' : ''}`}
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                        {!isSubmitting && <Send className="h-4 w-4" />}
                      </Button>
                    </CardFooter>
                  </form>
                )}
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Need to submit a content removal request instead? <Link to="/request" className="text-primary hover:underline">Click here</Link></p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <p>&copy; 2025 Content Moderation System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;