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

// File storage - using IndexedDB to store files persistently
const setupIndexedDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ContentModerationDB', 1);
    
    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create an object store for files
      if (!db.objectStoreNames.contains('files')) {
        const store = db.createObjectStore('files', { keyPath: 'id' });
        store.createIndex('requestId', 'requestId', { unique: true });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

// File operations
const saveFile = async (requestId, file) => {
  try {
    const db = await setupIndexedDB();
    return new Promise((resolve, reject) => {
      // Convert file to ArrayBuffer for storage
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      reader.onload = () => {
        const transaction = db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        
        // Store file with metadata
        const fileData = {
          id: requestId.toString(),
          requestId: requestId.toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result,
          lastModified: file.lastModified
        };
        
        const request = store.put(fileData);
        
        request.onsuccess = () => resolve(fileData);
        request.onerror = (e) => reject(e.target.error);
      };
      
      reader.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error('Error saving file:', error);
    throw error;
  }
};

const getFile = async (requestId) => {
  try {
    const db = await setupIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.get(requestId.toString());
      
      request.onsuccess = (event) => {
        const fileData = event.target.result;
        if (!fileData) {
          resolve(null);
          return;
        }
        
        // Convert back to File object
        const file = new File(
          [fileData.data], 
          fileData.name, 
          { 
            type: fileData.type, 
            lastModified: fileData.lastModified 
          }
        );
        
        resolve(file);
      };
      
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error('Error getting file:', error);
    return null;
  }
};

const deleteFile = async (requestId) => {
  try {
    const db = await setupIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.delete(requestId.toString());
      
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const RequestProvider = ({ children }) => {
  // Try to load stored requests from localStorage, or use initial data
  const [requests, setRequests] = useState(() => {
    const storedRequests = localStorage.getItem('removalRequests');
    return storedRequests ? JSON.parse(storedRequests) : initialRequests;
  });
  
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
  const addRequest = async (request) => {
    const id = Date.now();
    const newRequest = {
      ...request,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending',
      notes: "",
      ownershipVerified: false
    };
    
    // Store the file in IndexedDB if it exists
    if (request.proofFile) {
      try {
        await saveFile(id, request.proofFile);
        // Don't store the actual file in the request object
        delete newRequest.proofFile;
      } catch (error) {
        console.error('Error saving file', error);
      }
    }
    
    setRequests(prevRequests => [...prevRequests, newRequest]);
    return newRequest;
  };

  // Update a request
  const updateRequest = async (id, updates) => {
    // If updating the proof file, store it
    if (updates.proofFile) {
      try {
        await saveFile(id, updates.proofFile);
        // Don't store the actual file in the request object
        delete updates.proofFile;
      } catch (error) {
        console.error('Error updating file', error);
      }
    }
    
    setRequests(prevRequests => 
      prevRequests.map(req => req.id === id ? { ...req, ...updates } : req)
    );
  };

  // Delete a request
  const deleteRequest = async (id) => {
    // Delete associated file if exists
    try {
      await deleteFile(id);
    } catch (error) {
      console.error('Error deleting file', error);
    }
    
    setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
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

  return (
    <RequestContext.Provider value={{ 
      requests, 
      addRequest, 
      updateRequest, 
      deleteRequest,
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