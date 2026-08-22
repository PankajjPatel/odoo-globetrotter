import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserCircle } from 'lucide-react';
import './LoginScreen.css';

export const LoginScreen = () => {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className={`login-content animate-fade-in ${isSignup ? 'signup-mode' : ''}`}>
        <Card className="login-card glass">
          <div className="login-header">
            <div className="photo-placeholder">
              <UserCircle size={64} className="text-secondary" />
            </div>
            <h2>{isSignup ? 'Registration' : 'Login'}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {!isSignup ? (
              // Login Form
              <div className="form-group">
                <Input label="Username" id="username" type="text" placeholder="Enter username" required />
                <Input label="Password" id="password" type="password" placeholder="Enter password" required />
                <div className="submit-container">
                  <Button type="submit" variant="primary" size="lg">Login Button</Button>
                </div>
              </div>
            ) : (
              // Registration Form
              <div className="form-group">
                <div className="form-grid">
                  <Input label="First Name" id="firstName" type="text" placeholder="First Name" required />
                  <Input label="Last Name" id="lastName" type="text" placeholder="Last Name" required />
                  
                  <Input label="Email Address" id="email" type="email" placeholder="Email Address" required />
                  <Input label="Phone Number" id="phone" type="tel" placeholder="Phone Number" required />
                  
                  <Input label="City" id="city" type="text" placeholder="City" required />
                  <Input label="Country" id="country" type="text" placeholder="Country" required />
                </div>
                
                <div className="input-group">
                  <label htmlFor="additionalInfo" className="input-label">Additional Information</label>
                  <textarea 
                    id="additionalInfo" 
                    className="input-field textarea-field" 
                    placeholder="Additional Information ...."
                    rows="4"
                  ></textarea>
                </div>

                <div className="submit-container">
                  <Button type="submit" variant="primary" size="lg">Register Users</Button>
                </div>
              </div>
            )}
          </form>

          <div className="login-footer">
            <p>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button type="button" className="btn-ghost toggle-auth-btn" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
