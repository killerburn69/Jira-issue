// Simple token management
export const auth = {
    // Save token to localStorage
    setToken: (token: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
    },
  
    // Get token from localStorage
    getToken: (): string | null => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
      }
      return null;
    },
  
    // Remove token
    removeToken: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  
    // Check if user is logged in
    isLoggedIn: (): boolean => {
      if (typeof window !== 'undefined') {
        return !!localStorage.getItem('token');
      }
      return false;
    }
  };