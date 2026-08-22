import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { UserCircle, Compass, AlertCircle, CheckCircle2, Lock, Mail, KeyRound } from 'lucide-react';
import './LoginScreen.css';

export const LoginScreen = () => {
  // modes: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, forgotPassword } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (mode === 'signup') {
      if (!formData.name || formData.name.trim().length < 2) {
        setErrorMessage('Please enter your full name (minimum 2 characters).');
        return false;
      }
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return false;
      }
    } else if (mode === 'login') {
      if (!formData.email.trim()) {
        setErrorMessage('Please enter your email or username.');
        return false;
      }
      if (!formData.password) {
        setErrorMessage('Please enter your password.');
        return false;
      }
    } else if (mode === 'forgot') {
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setErrorMessage('New password must be at least 6 characters long.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        await signup(
          formData.name.trim(),
          formData.email.trim(),
          formData.password,
          formData.confirmPassword
        );
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else if (mode === 'login') {
        await login(formData.email.trim(), formData.password);
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else if (mode === 'forgot') {
        const res = await forgotPassword(
          formData.email.trim(),
          formData.password,
          formData.confirmPassword
        );
        setSuccessMessage(res.message || 'Password reset successfully! Redirecting...');
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }, 1200);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>

      <div className={`login-content animate-fade-in ${mode === 'signup' ? 'signup-mode' : ''}`}>
        <Card className="login-card glass">
          <div className="login-header">
            <div className="photo-placeholder">
              <Compass size={44} className="text-primary-brand" />
            </div>
            <h2>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="login-subtitle text-secondary">
              {mode === 'login' && 'Enter your details to access your travel plans'}
              {mode === 'signup' && 'Join GlobeTrotter and start organizing journeys'}
              {mode === 'forgot' && 'Enter your registered email and choose a new password'}
            </p>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert-error animate-fade-in" role="alert">
              <AlertCircle size={18} className="alert-icon" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert auth-alert-success animate-fade-in" role="status">
              <CheckCircle2 size={18} className="alert-icon" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {mode === 'login' && (
              <div className="form-group">
                <div className="input-group">
                  <label htmlFor="login-email" className="input-label">Email or Username</label>
                  <div className="input-with-icon-left">
                    <Mail size={18} className="field-icon" />
                    <input
                      id="login-email"
                      name="email"
                      type="text"
                      className="input-field"
                      placeholder="e.g. explorer@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="label-row">
                    <label htmlFor="login-password" className="input-label">Password</label>
                    <button
                      type="button"
                      className="forgot-link"
                      onClick={() => switchMode('forgot')}
                      disabled={loading}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="input-with-icon-left">
                    <Lock size={18} className="field-icon" />
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      className="input-field"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="submit-container">
                  <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                    {loading ? 'Signing In...' : 'Log In'}
                  </Button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="form-group">
                <div className="form-grid">
                  <div className="input-group full-span">
                    <label htmlFor="signup-name" className="input-label">Full Name</label>
                    <div className="input-with-icon-left">
                      <UserCircle size={18} className="field-icon" />
                      <input
                        id="signup-name"
                        name="name"
                        type="text"
                        className="input-field"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group full-span">
                    <label htmlFor="signup-email" className="input-label">Email Address</label>
                    <div className="input-with-icon-left">
                      <Mail size={18} className="field-icon" />
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        className="input-field"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="signup-password" className="input-label">Password</label>
                    <div className="input-with-icon-left">
                      <Lock size={18} className="field-icon" />
                      <input
                        id="signup-password"
                        name="password"
                        type="password"
                        className="input-field"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="signup-confirm" className="input-label">Confirm Password</label>
                    <div className="input-with-icon-left">
                      <Lock size={18} className="field-icon" />
                      <input
                        id="signup-confirm"
                        name="confirmPassword"
                        type="password"
                        className="input-field"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="submit-container">
                  <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </div>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="form-group">
                <div className="input-group">
                  <label htmlFor="forgot-email" className="input-label">Registered Email Address</label>
                  <div className="input-with-icon-left">
                    <Mail size={18} className="field-icon" />
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      className="input-field"
                      placeholder="Enter your registered email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="forgot-new-password" className="input-label">New Password</label>
                  <div className="input-with-icon-left">
                    <KeyRound size={18} className="field-icon" />
                    <input
                      id="forgot-new-password"
                      name="password"
                      type="password"
                      className="input-field"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="forgot-confirm-password" className="input-label">Confirm New Password</label>
                  <div className="input-with-icon-left">
                    <KeyRound size={18} className="field-icon" />
                    <input
                      id="forgot-confirm-password"
                      name="confirmPassword"
                      type="password"
                      className="input-field"
                      placeholder="Re-enter new password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="submit-container">
                  <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="login-footer">
            {mode === 'login' && (
              <p>
                Don't have an account?
                <button
                  type="button"
                  className="toggle-auth-btn"
                  onClick={() => switchMode('signup')}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p>
                Already have an account?
                <button
                  type="button"
                  className="toggle-auth-btn"
                  onClick={() => switchMode('login')}
                  disabled={loading}
                >
                  Log In
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your password?
                <button
                  type="button"
                  className="toggle-auth-btn"
                  onClick={() => switchMode('login')}
                  disabled={loading}
                >
                  Back to Log In
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
