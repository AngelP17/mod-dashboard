// src/components/RequestContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial demo data
const initialRequests = [
  {
    id: 1,
    email: "creator@example.com",
    url: "https://example.com/content",
    timestamp: "2025-02-03T10:30:00",
    description: "Website no longer active - requesting removal",
    proofOfOwnership: "domain-verification.pdf",
    proofFile: null, // No actual file for demo data
    status: "pending",
    notes: "",
    contentType: "website",
    ownershipVerified: false,
    priority: "medium"
  },
  {
    id: 2,
    email: "publisher@example.com",
    url: "https://example.com/archived-content",
    timestamp: "2025-02-03T09:15:00",
    description: "DMCA takedown request - copyrighted material",
    proofOfOwnership: "copyright-certificate.pdf",
    proofFile: null, // No actual file for demo data
    status: "pending",
    notes: "",
    contentType: "media",
    ownershipVerified: true,
    priority: "high"
  }
];

// Create context
const RequestContext = createContext();

// File storage - this will store uploaded files in memory
// In a real app, you'd use cloud storage
const fileStorage = new Map();

export const RequestProvider = ({ children }) => {
  // Try to load stored requests from localStorage, or use initial data
  const [requests, setRequests] = useState(() => {
    const storedRequests = localStorage.getItem('removalRequests');
    return storedRequests ? JSON.parse(storedRequests) : initialRequests;
  });

  // We can't store File objects in localStorage, so we only store references
  // Save requests to localStorage whenever they change
  useEffect(() => {
    // Create a version without actual file objects for localStorage
    const requestsForStorage = requests.map(req => {
      const { proofFile, ...rest } = req;
      return rest;
    });
    localStorage.setItem('removalRequests', JSON.stringify(requestsForStorage));
  }, [requests]);

  // Add a new request
  const addRequest = (request) => {
    const id = Date.now();
    const newRequest = {
      ...request,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending',
      notes: "",
      ownershipVerified: false
    };
    
    // Store the file in our Map if it exists
    if (request.proofFile) {
      fileStorage.set(id.toString(), request.proofFile);
    }
    
    setRequests(prevRequests => [...prevRequests, newRequest]);
    return newRequest;
  };

  // Update a request
  const updateRequest = (id, updates) => {
    // If updating the proof file, store it
    if (updates.proofFile) {
      fileStorage.set(id.toString(), updates.proofFile);
    }
    
    setRequests(prevRequests => 
      prevRequests.map(req => req.id === id ? { ...req, ...updates } : req)
    );
  };

  // Get request statistics
  const getStats = () => {
    return {
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      highPriority: requests.filter(r => r.priority === 'high' && r.status === 'pending').length
    };
  };

  // Get a file by request ID
  const getFile = (id) => {
    return fileStorage.get(id.toString());
  };

  return (
    <RequestContext.Provider value={{ 
      requests, 
      addRequest, 
      updateRequest, 
      getStats,
      getFile 
    }}>
      {children}
    </RequestContext.Provider>
  );
};

// Custom hook to use the request context
export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};