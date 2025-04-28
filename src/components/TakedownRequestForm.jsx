// src/components/TakedownRequestForm.jsx
import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Input } from './ui/Input';
import { Shield, ArrowRight, Upload, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRequests } from './RequestContext';

const TakedownRequestForm = () => {
  // Access the request context
  const { addRequest } = useRequests();
  
  // State for form fields
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('website');
  const [priority, setPriority] = useState('medium');
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  
  // Constants for file validation
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.txt'];
  
  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!url) newErrors.url = 'URL is required';
    else if (!/^https?:\/\/\S+/.test(url)) newErrors.url = 'URL must start with http:// or https://';
    
    if (!description) newErrors.description = 'Description is required';
    
    if (!proofFile) newErrors.proofFile = 'Proof of ownership is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create request object
      const newRequest = {
        email,
        url,
        description,
        proofOfOwnership: proofFile ? proofFile.name : 'ownership-proof.pdf',
        proofFile, // Store the actual file object
        contentType,
        priority
      };
      
      // Add the request to the context (this now properly saves the file)
      const createdRequest = await addRequest(newRequest);
      setRequestId(createdRequest.id);
      
      setSubmitSuccess(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setEmail('');
        setUrl('');
        setDescription('');
        setContentType('website');
        setPriority('medium');
        setProofFile(null);
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e) => {
    setFileError('');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
        return;
      }
      
      // Validate file type
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        setFileError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
        return;
      }
      
      setProofFile(file);
    }
  };
  
  // If submission was successful, show success message
  if (submitSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Request Submitted
            </CardTitle>
            <CardDescription>
              Thank you for your submission. Your request has been received and will be reviewed by our moderation team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">Request ID: <span className="font-medium">#{requestId}</span></p>
            <p className="text-foreground">Status: <span className="text-yellow-500 font-medium">Pending</span></p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              onClick={() => setSubmitSuccess(false)} 
              variant="outline"
            >
              Submit Another Request
            </Button>
            <Link to="/dashboard">
              <Button>
                View All Requests
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Content Removal Request</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-primary hover:underline">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm text-primary hover:underline">
            Moderator Login
          </Link>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Submit a Takedown Request</CardTitle>
              <CardDescription>
                Please provide the details below to request content removal. Our moderation team will review your request.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-background text-foreground ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Content URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/content-to-remove"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`bg-background text-foreground ${errors.url ? 'border-destructive' : ''}`}
                  />
                  {errors.url && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.url}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Request Description
                  </label>
                  <textarea
                    placeholder="Please describe why this content should be removed..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full min-h-[100px] rounded-md border border-input bg-background p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.description ? 'border-destructive' : ''}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Content Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="website">Website</option>
                      <option value="media">Media</option>
                      <option value="document">Document</option>
                      <option value="social">Social Media Post</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Priority
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (for urgent removal)</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Proof of Ownership
                  </label>
                  <div className={`border-2 border-dashed rounded-md p-6 text-center ${
                    errors.proofFile || fileError ? 'border-destructive' : 'border-border'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {proofFile ? proofFile.name : 'Upload documentation proving your ownership'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, JPG, PNG up to 10MB
                      </p>
                      <Input
                        type="file"
                        id="fileUpload"
                        accept=".pdf,.jpg,.jpeg,.png,.txt"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('fileUpload').click()}
                      >
                        Select File
                      </Button>
                    </div>
                  </div>
                  {errors.proofFile && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.proofFile}
                    </p>
                  )}
                  {fileError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {fileError}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      className="h-4 w-4 rounded border-border text-primary"
                      required
                    />
                    <label htmlFor="termsCheckbox" className="ml-2 text-sm text-muted-foreground">
                      I confirm that all information provided is accurate and I have the right to request removal of this content.
                    </label>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default TakedownRequestForm;