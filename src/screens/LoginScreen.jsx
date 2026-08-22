import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Compass } from 'lucide-react';
import './LoginScreen.css';

export const LoginScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy authentication
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content animate-fade-in">
        <Card className="login-card glass">
          <div className="login-header">
            <Compass size={48} className="login-logo" />
            <h1>GlobeTrotter</h1>
            <p>{isSignup ? 'Create your account to start planning.' : 'Welcome back! Plan your next adventure.'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {isSignup && (
              <Input label="Full Name" id="name" type="text" placeholder="John Doe" required />
            )}
            <Input label="Email Address" id="email" type="email" placeholder="you@example.com" required />
            <Input label="Password" id="password" type="password" placeholder="••••••••" required />
            
            {!isSignup && (
              <div className="login-options">
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            )}
            
            <Button type="submit" variant="primary" size="lg" className="w-full mt-4">
              {isSignup ? 'Sign Up' : 'Log In'}
            </Button>
          </form>

          <div className="login-footer">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button className="btn-ghost toggle-auth-btn" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
