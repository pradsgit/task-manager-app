import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom useAuth hook
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Test logging to verify hook returns user state correctly
  console.log('useAuth hook - user:', context.user, 'loading:', context.loading);
  
  return context;
};

export default useAuth;
