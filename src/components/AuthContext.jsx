// src/components/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial demo moderator accounts
const initialModerators = [
  {
    id: 1,
    email: "admin@example.com",
    password: "admin123", // In a real app, you would NEVER store plain text passwords
    name: "Admin User",
    role: "admin"
  },
  {
    id: 2,
    email: "moderator@example.com",
    password: "mod123", // In a real app, you would use proper password hashing
    name: "Content Moderator",
    role: "moderator"
  },
  {
    id: 3,
    email: "admin@example.com",
    password: "admin123", // In a real app, you would NEVER store plain text passwords
    name: "Admin User",
    role: "admin"
  },
  {
    id: 4,
    email: "moderator@example.com",
    password: "mod123", // In a real app, you would use proper password hashing
    name: "Content Moderator",
    role: "moderator"
  }
];

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Try to load stored user from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('moderationUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // Try to load stored moderators from localStorage, or use initial data
  const [moderators, setModerators] = useState(() => {
    const storedModerators = localStorage.getItem('moderationUsers');
    return storedModerators ? JSON.parse(storedModerators) : initialModerators;
  });

  // Save moderators to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('moderationUsers', JSON.stringify(moderators));
  }, [moderators]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // Don't store password in localStorage for current user
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('moderationUser', JSON.stringify(userWithoutPassword));
    } else {
      localStorage.removeItem('moderationUser');
    }
  }, [user]);

  // Login function
  const login = (email, password) => {
    const foundUser = moderators.find(
      mod => mod.email === email && mod.password === password
    );
    
    if (foundUser) {
      // Don't include password in the user state
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, error: "Invalid email or password" };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('moderationUser');
  };

  // Add a new moderator
  const addModerator = (moderator) => {
    // Check if current user is an admin
    if (!user || user.role !== 'admin') {
      console.error('Only administrators can add new moderators');
      return { success: false, error: 'Permission denied' };
    }
    
    const newModerator = {
      ...moderator,
      id: Date.now()
    };
    
    setModerators(prevModerators => [...prevModerators, newModerator]);
    return { success: true, moderator: newModerator };
  };

  // Update a moderator
  const updateModerator = (id, updates) => {
    // Check if current user is an admin
    if (!user || user.role !== 'admin') {
      console.error('Only administrators can update moderators');
      return { success: false, error: 'Permission denied' };
    }
    
    setModerators(prevModerators => 
      prevModerators.map(mod => mod.id === id ? { ...mod, ...updates } : mod)
    );
    return { success: true };
  };

  // Delete a moderator
  const deleteModerator = (id) => {
    // Check if current user is an admin
    if (!user || user.role !== 'admin') {
      console.error('Only administrators can delete moderators');
      return { success: false, error: 'Permission denied' };
    }
    
    // Prevent self-deletion
    if (user.id === id) {
      console.error('You cannot delete your own account');
      return { success: false, error: 'Cannot delete your own account' };
    }
    
    setModerators(prevModerators => prevModerators.filter(mod => mod.id !== id));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      moderators,
      login, 
      logout, 
      addModerator, 
      updateModerator,
      deleteModerator 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};