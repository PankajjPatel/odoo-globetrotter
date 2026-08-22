import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = 'http://127.0.0.1:8000';

const apiFetch = async (endpoint, options = {}) => {
  let res;
  try {
    res = await fetch(endpoint, options);
    if (res.status === 502 || res.status === 504) {
      const directUrl = `${API_BASE_URL}${endpoint}`;
      res = await fetch(directUrl, options);
    }
  } catch (err) {
    try {
      const directUrl = `${API_BASE_URL}${endpoint}`;
      res = await fetch(directUrl, options);
    } catch (directErr) {
      throw directErr;
    }
  }
  return res;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('globetrotter_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('globetrotter_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Check auth session on startup
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('globetrotter_token');
      if (savedToken) {
        try {
          const res = await apiFetch('/api/auth/me/', {
            headers: {
              'Authorization': `Token ${savedToken}`,
              'Content-Type': 'application/json',
            },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
          } else {
            // Token expired or invalid
            logout();
          }
        } catch {
          // If network is offline, keep existing local state
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const signup = async (name, email, password, confirmPassword) => {
    let res;
    let data;
    try {
      res = await apiFetch('/api/auth/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });
      data = await res.json().catch(() => ({}));
    } catch {
      throw new Error('Unable to connect to the backend server. Please make sure Django server is running.');
    }

    if (!res.ok) {
      let errorMessage = '';
      if (data.errors && typeof data.errors === 'object') {
        const errorEntries = Object.entries(data.errors);
        if (errorEntries.length > 0) {
          const [field, msgs] = errorEntries[0];
          errorMessage = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
      }
      if (!errorMessage && data.message) {
        errorMessage = data.message;
      }
      if (!errorMessage) {
        if (res.status >= 500 || !data || Object.keys(data).length === 0) {
          errorMessage = 'Unable to connect to the backend server. Please make sure Django server is running.';
        } else {
          errorMessage = 'Signup failed';
        }
      }
      throw new Error(errorMessage);
    }

    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('globetrotter_token', data.token);
      localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
    }

    return data;
  };

  const login = async (email, password) => {
    let res;
    let data;
    try {
      res = await apiFetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      data = await res.json().catch(() => ({}));
    } catch {
      throw new Error('Unable to connect to the backend server. Please make sure Django server is running.');
    }

    if (!res.ok) {
      let errorMessage = '';
      if (data.errors && typeof data.errors === 'object') {
        const errorEntries = Object.entries(data.errors);
        if (errorEntries.length > 0) {
          const [field, msgs] = errorEntries[0];
          errorMessage = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
      }
      if (!errorMessage && data.message) {
        errorMessage = data.message;
      }
      if (!errorMessage) {
        if (res.status >= 500 || !data || Object.keys(data).length === 0) {
          errorMessage = 'Unable to connect to the backend server. Please make sure Django server is running.';
        } else {
          errorMessage = 'Invalid email or password';
        }
      }
      throw new Error(errorMessage);
    }

    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('globetrotter_token', data.token);
      localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
    }

    return data;
  };

  const forgotPassword = async (email, newPassword, confirmPassword) => {
    let res;
    let data;
    try {
      res = await apiFetch('/api/auth/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });
      data = await res.json().catch(() => ({}));
    } catch {
      throw new Error('Unable to connect to the backend server. Please make sure Django server is running.');
    }

    if (!res.ok) {
      let errorMessage = '';
      if (data.errors && typeof data.errors === 'object') {
        const errorEntries = Object.entries(data.errors);
        if (errorEntries.length > 0) {
          const [field, msgs] = errorEntries[0];
          errorMessage = Array.isArray(msgs) ? msgs[0] : String(msgs);
        }
      }
      if (!errorMessage && data.message) {
        errorMessage = data.message;
      }
      if (!errorMessage) {
        if (res.status >= 500 || !data || Object.keys(data).length === 0) {
          errorMessage = 'Unable to connect to the backend server. Please make sure Django server is running.';
        } else {
          errorMessage = 'Password reset failed';
        }
      }
      throw new Error(errorMessage);
    }

    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('globetrotter_token', data.token);
      localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
    }

    return data;
  };

  const updateProfile = async (profileData) => {
    if (!token) throw new Error('Not authenticated.');
    const res = await apiFetch('/api/auth/profile/', {
      method: 'PATCH',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile.');
    }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('globetrotter_user', JSON.stringify(data.user));
    }
    return data;
  };

  const deleteAccount = async () => {
    if (!token) throw new Error('Not authenticated.');
    const res = await apiFetch('/api/auth/delete-account/', {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete account.');
    }
    logout();
    return data;
  };

  const logout = async () => {
    try {
      if (token) {
        await apiFetch('/api/auth/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('globetrotter_token');
      localStorage.removeItem('globetrotter_user');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    signup,
    login,
    forgotPassword,
    logout,
    updateProfile,
    deleteAccount,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
